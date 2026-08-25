#!/usr/bin/env bash
# Authenticated curl against the Patch API, with token rotation handled.
#
#   scripts/api.sh login <phone>          # sends an OTP
#   scripts/api.sh verify <phone> <code>  # stores access+refresh
#   scripts/api.sh admin <user> <pass>    # admin token (no refresh)
#   scripts/api.sh GET /api/v1/matches
#   scripts/api.sh POST /api/v1/matches '{"title":"..."}'
#
# Session lives in .api-session.json (gitignored). Access tokens last 15 min, so
# every request refreshes first when the stored one is expired.
set -euo pipefail
cd "$(dirname "$0")/.."
BASE="${API_BASE_URL:-https://api.patchapp.ir}"
S=.api-session.json

j() { python3 -c "import json,sys;print(json.load(sys.stdin).get('$1',''))"; }
# Only ever persist a real token pair. The API 500s during deploys, and blindly
# saving the response wrote an error body over the session — one bad refresh and
# the login was gone.
save() { python3 -c "
import json,sys
try: d=json.load(sys.stdin)
except Exception: sys.exit('api: non-JSON response, session left alone')
if not d.get('accessToken'):
    sys.exit('api: no accessToken in response, session left alone: '+json.dumps(d,ensure_ascii=False)[:200])
json.dump(d,open('$S','w'))
print(json.dumps(d,ensure_ascii=False))"; }

case "${1:-}" in
  login)  curl -sS -X POST "$BASE/api/v1/otp/request" -H 'Content-Type: application/json' \
            -d "{\"phoneNumber\":\"$2\"}"; echo; exit ;;
  verify) curl -sS -X POST "$BASE/api/v1/otp/verify" -H 'Content-Type: application/json' \
            -d "{\"phoneNumber\":\"$2\",\"code\":\"$3\"}" | save; exit ;;
  admin)  curl -sS -X POST "$BASE/api/v1/auth/admin/login" -H 'Content-Type: application/json' \
            -d "{\"username\":\"$2\",\"password\":\"$3\"}" | save; exit ;;
esac

[ -f "$S" ] || { echo "no session — run: $0 login <phone>" >&2; exit 1; }

# Refresh when the JWT's exp has passed. ponytail: refreshes on expiry only;
# if the server starts revoking early, refresh on 401 and replay instead.
tok=$(j accessToken < "$S")
exp=$(cut -d. -f2 <<<"$tok" | python3 -c "
import base64,json,sys
s=sys.stdin.read().strip(); s+='='*(-len(s)%4)
print(json.loads(base64.urlsafe_b64decode(s)).get('exp',0))" 2>/dev/null || echo 0)
if [ "$exp" -lt "$(date +%s)" ]; then
  rt=$(j refreshToken < "$S")
  [ -n "$rt" ] || { echo "token expired and no refreshToken (admin session?) — re-run admin login" >&2; exit 1; }
  curl -sS -X POST "$BASE/api/v1/auth/refresh" -H 'Content-Type: application/json' \
    -d "{\"refreshToken\":\"$rt\"}" | save >/dev/null || exit 1
  tok=$(j accessToken < "$S")
fi

m=$1; p=$2; shift 2
curl -sS -X "$m" "$BASE$p" -H "Authorization: Bearer $tok" \
  ${1+-H 'Content-Type: application/json' -d "$1"} -w '\n[%{http_code}]\n'
