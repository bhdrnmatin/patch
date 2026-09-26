// Wire shapes for api.patchapp.ir (/api/v1). Kept separate from the UI
// view-models in lib/types.ts — map between them at the call site.

export interface RequestOtpResponse {
  nextResendAllowedAt: string; // ISO date-time
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  /**
   * Where to send the user next, straight from the verify call — the same
   * answer `GET /players/me`'s `profileStatus` gives, half a round trip
   * earlier. Declared in the spec and confirmed live 2026-09-22. Optional
   * because a deploy that predates it would simply omit it.
   */
  profileCompletionStatus?: "INCOMPLETE" | "COMPLETE";
}

// profileStatus distinguishes a freshly-verified user (needs profile-setup)
// from a complete one; exact string values are confirmed against a live /me.
export type PreferredSide = "RIGHT" | "LEFT";

export interface PlayerResponse {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  residenceCityId: string;
  username: string; // backend still returns it; no longer shown/sent — removal pending
  preferredSide?: PreferredSide;
  avatarUrl: string;
  bio: string;
  status: string;
  profileStatus: string;
}

// All fields are required by the API.
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  gender: string;
  residenceCityId: string;
}

export interface ProvinceResponse {
  id: string;
  name: string;
  telPrefix: string;
}

export interface CityResponse {
  id: string;
  name: string;
}

export interface UpdateDisplayInfoRequest {
  bio?: string;
  preferredSide?: PreferredSide;
}

export interface ClubResponse {
  id: string;
  cityId: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  description?: string;
  bannerUrl?: string;
  logoUrl?: string;
  status: string;
}

/** Every list endpoint on this API pages the same way. */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
}

/* ── Matches ────────────────────────────────────────────────────────────────
 * Shapes from `GET /v3/api-docs`, verified against the live API 2026-09-12.
 * Constraints the spec states and a probe confirmed:
 *   · `matchType: COMPETITIVE` → 400 «مسابقات رقابتی هنوز فعال نشده‌اند»
 *   · a missing `title` → 500, so it is required in practice
 *   · `capacity` minimum 4, `durationHours` minimum 1
 *   · `scheduledAt` is a java.time.Instant and must have zero UTC minutes
 */

export type ApiMatchFormat = "OPEN_MATCH" | "AMERICANO" | "MEXICANO";
export type ApiMatchType = "FRIENDLY" | "COMPETITIVE";
export type ApiVisibility = "PUBLIC" | "PRIVATE";
export type ApiJoinPolicy = "OPEN" | "MANUAL_APPROVE" | "INVITE_LINK_ONLY";

/**
 * Declared by the backend on 2026-09-19, after four months as a bare `string`
 * in the spec (api-findings §0d). There is no LIVE — a match in progress is
 * still OPEN — so the live/upcoming split stays arithmetic on `scheduledAt`.
 * `AUTO_CANCELLED` is the one nobody had seen: a match the server cancelled
 * itself, and it counts as cancelled everywhere `CANCELLED` does.
 */
export type ApiMatchStatus = "OPEN" | "FINISHED" | "CANCELLED" | "AUTO_CANCELLED";

/** Declared 2026-09-19 with the above. Only CONFIRMED is on the court; only
 *  REQUESTED is waiting to be. REJECTED, LEFT and KICKED are all out. */
export type ApiParticipantStatus =
  | "CONFIRMED"
  | "REQUESTED"
  | "REJECTED"
  | "LEFT"
  | "KICKED";

/**
 * How a participant got in. Declared 2026-09-19 with the rest; nothing reads it
 * yet, but it is the only field that can tell an invited player from one who
 * asked. `INVITE_LINK` is the share-link flow, which the app has not built.
 */
export type ApiJoinChannel = "OPEN" | "REQUEST" | "INVITE_LINK" | "DIRECT_INVITE";

/** An invitation's life: created PENDING, then accepted by the invitee or
 *  cancelled by the organizer. Declared 2026-09-19. */
export type ApiInvitationStatus = "PENDING" | "ACCEPTED" | "CANCELLED";

export interface CreateMatchRequest {
  format: ApiMatchFormat;
  matchType: ApiMatchType;
  clubId: string;
  /** ISO instant with an offset. Naive local time is rejected as unparseable. */
  scheduledAt: string;
  visibility: ApiVisibility;
  joinPolicy: ApiJoinPolicy;
  /** Declared optional; omitting it 500s. Max 80. */
  title: string;
  /** Declared optional; omitting it 400s. Minimum 4. */
  capacity: number;
  /** Declared optional; omitting it 400s. Minimum 1, integer. */
  durationHours: number;
  /** Max 500. */
  description?: string;
  /** Max 50. Not collected by the wizard. */
  courtLabel?: string;
  /** Does the organizer take a capacity slot? Defaults true when omitted. */
  organizerJoins?: boolean;
}

export interface MatchOrganizerResponse {
  accountId: string;
  photoUrl: string | null;
  firstName: string;
  lastName: string;
}

export interface MatchParticipantResponse {
  id: string;
  matchId: string;
  accountId: string;
  /** Declared 2026-09-19; see `ApiParticipantStatus`. */
  status: ApiParticipantStatus;
  /** Declared 2026-09-19; see `ApiJoinChannel`. */
  joinChannel: ApiJoinChannel;
  requestedAt: string;
  decidedAt: string | null;
  photoUrl: string | null;
  firstName: string;
  lastName: string;
  /** Present for the organizer's own view; may be absent for others. */
  phoneNumber?: string;
}

/**
 * One person `GET /matches/invitations/suggestions` offers to invite.
 *
 * `phoneNumber` is the point: the invite endpoint takes phone numbers only
 * (account ids are still 400, re-probed 2026-09-19), so without it the wizard's
 * «از بین بازیکنان پچ» list could show people it had no way to invite. The API
 * started sending it between 2026-09-16 and 2026-09-19.
 */
export interface InviteSuggestionResponse {
  accountId: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  phoneNumber: string;
}

/**
 * An invitation, from `GET /matches/invitations/me` (the invitee's own) or
 * inside an `InviteDirectResponse`. It carries `matchId` and nothing else about
 * the match, so a list of these needs a `GET /matches/{id}` each to say what
 * they are invitations *to*.
 *
 * Accepting is `POST …/{id}/accept`, declining `POST …/{id}/decline` (new
 * 2026-09-24). `DELETE …/{id}` is the organizer cancelling one they sent — an
 * invitee who calls it gets 403.
 */
export interface MatchInvitationResponse {
  id: string;
  matchId: string;
  inviteeAccountId: string;
  status: ApiInvitationStatus;
  createdAt: string;
  acceptedAt: string | null;
}

/** One row of `POST /matches/{id}/invitations` — each phone succeeds or fails alone. */
export interface InviteDirectResponse {
  phoneNumber: string;
  success: boolean;
  /** Persian for a malformed number, but a raw i18n key for the others
   *  (`matchmaking.invite.alreadyInvited`) — see `inviteFailureText`. */
  failureMessage: string | null;
}

/** One team in a game: exactly two **account** ids (not participant ids). */
export interface ResultTeam {
  name?: string;
  participantIds: string[];
}

/** One game: its two teams and their sets, in order played. Scores ≥ 0. */
export interface ResultGame {
  teamA: ResultTeam;
  teamB: ResultTeam;
  sets: { teamAScore: number; teamBScore: number }[];
}

/** `POST /matches/{id}/result`. The API takes any number of games (players may
 *  swap teams between them); the app sends one (user, 2026-09-24). */
export interface SubmitMatchResultRequest {
  games: ResultGame[];
}

/**
 * A submitted result, which the match's confirmed players then vote on
 * (`POST …/result/vote`, ACCEPT/REJECT). `status` and `myVote` are undeclared
 * strings — no real result has been seen yet (2026-09-24).
 */
export interface MatchResultResponse {
  id: string;
  matchId: string;
  round: number;
  status: string;
  games: ResultGame[];
  totalConfirmedParticipants: number;
  rejectCount: number;
  myVote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MatchResponse {
  id: string;
  organizer: MatchOrganizerResponse;
  format: ApiMatchFormat;
  matchType: ApiMatchType;
  title: string | null;
  description: string | null;
  capacity: number;
  clubId: string;
  courtLabel: string | null;
  scheduledAt: string;
  durationHours: number;
  visibility: ApiVisibility;
  joinPolicy: ApiJoinPolicy;
  /** Declared 2026-09-19; see `ApiMatchStatus`. */
  status: ApiMatchStatus;
  inviteToken: string | null;
  /** null on create; populated by `GET /matches/{id}`. */
  participants: MatchParticipantResponse[] | null;
}

