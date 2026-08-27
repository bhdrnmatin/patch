// Runnable self-check for apiFetch's 401 handling.
// Run: npx tsx lib/api/client.test.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from "node:assert/strict";
import { apiFetch, ApiError } from "./client";

// --- stand-ins ---------------------------------------------------------------
// session.ts and client.ts touch only localStorage and location, and only from
// inside functions, so plain objects installed at load time are enough.
const store = new Map<string, string>();
let assigned: string | null = null;
(globalThis as any).window = {
  localStorage: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  },
  location: {
    pathname: "/matches/create",
    assign: (url: string) => {
      assigned = url;
    },
  },
};

type Reply = { status: number; body?: unknown };
let reply: (url: string) => Reply;
let calls: string[] = [];
(globalThis as any).fetch = async (url: string, init: any) => {
  calls.push(`${init?.method ?? "GET"} ${url}`);
  const { status, body } = reply(String(url));
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => (body === undefined ? "" : JSON.stringify(body)),
    json: async () => body,
  };
};

/** A JWT-shaped token whose `exp` is `secs` from now. Only the payload matters. */
function jwt(secs: number): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + secs })
  ).toString("base64url");
  return `header.${payload}.signature`;
}

function session(accessSecs = 900) {
  store.clear();
  store.set("patch.accessToken", jwt(accessSecs));
  store.set("patch.refreshToken", "refresh-token");
  assigned = null;
  calls = [];
}

const refreshed = { accessToken: jwt(900), refreshToken: "next-refresh" };

async function main() {
  // 1. The signing-key-rotation case: the token still looks valid locally (exp
  //    is 15 min out) but the server rejects it, and the refresh token too. This
  //    must end the session — the old rule kept it and stranded the user on an
  //    error screen whose retry button replayed the same 401.
  session();
  reply = () => ({ status: 401 });
  await assert.rejects(
    () => apiFetch("/clubs"),
    (e: unknown) => e instanceof ApiError && e.status === 401
  );
  assert.equal(store.get("patch.accessToken"), undefined, "session must be cleared");
  assert.equal(assigned, "/login", "must route to login");

  // 2. A genuinely stale access token recovers: one refresh, one replay, no logout.
  session();
  reply = (url) => {
    if (url.endsWith("/auth/refresh")) return { status: 200, body: refreshed };
    return calls.some((c) => c.includes("/auth/refresh"))
      ? { status: 200, body: { content: [] } }
      : { status: 401 };
  };
  assert.deepEqual(await apiFetch("/clubs"), { content: [] });
  assert.equal(assigned, null, "a recovered session must not log out");
  assert.equal(store.get("patch.refreshToken"), "next-refresh", "rotated token stored");

  // 3. Refresh succeeds but the replay is still 401 — one retry only, then out.
  session();
  reply = (url) => (url.endsWith("/auth/refresh") ? { status: 200, body: refreshed } : { status: 401 });
  await assert.rejects(() => apiFetch("/clubs"), ApiError);
  assert.equal(assigned, "/login");
  assert.equal(
    calls.filter((c) => c.includes("/auth/refresh")).length,
    1,
    "one refresh attempt, no loop"
  );

  // 4. Public calls are untouched by any of this.
  session();
  reply = () => ({ status: 401 });
  await assert.rejects(() => apiFetch("/clubs", { auth: false }), ApiError);
  assert.equal(assigned, null, "an unauthenticated call must not end the session");
  assert.ok(store.get("patch.accessToken"), "session must survive");

  console.log("api client: ok");
}

main();
