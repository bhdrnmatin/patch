export type Sport = "padel" | "tennis";
export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface Player {
  id: string;
  name: string;
  avatar: string;
  sport: Sport[];
  skillLevel: SkillLevel;
  location: string;
}

export interface Match {
  id: string;
  sport: Sport;
  date: string;
  time: string;
  location: string;
  courtName: string;
  skillLevel: SkillLevel;
  totalSpots: number;
  filledSpots: number;
  players: Player[];
  host: Player;
  pricePerPlayer: number;
}

export type MatchStatus = "active" | "held" | "not-held";

export interface MatchPlayer {
  name: string;
  /**
   * The **participant** id, which is what removing them is addressed to. Only
   * a roster player from the API has one; the wizard's pick list doesn't.
   */
  participantId?: string;
  /** The organizer's own row — they can't be removed, so it carries no ✕. */
  isOrganizer?: boolean;
  /**
   * Only the wizard's pick list carries one, from the invite suggestions — it is
   * how a picked player is invited, since the API invites by phone alone. Never
   * rendered; a roster player has none.
   */
  phone?: string;
  /**
   * Skill level. Optional because the API carries none yet — levels, price and
   * entry fee all land after the MVP (user, 2026-09-13). Until then `PlayerSlot`
   * omits the line rather than printing «لول ۰», which would read as a real
   * rating of zero.
   */
  level?: number;
  avatar?: string;
  /** The **account** id — what a match result names its teams by. Roster players only. */
  accountId?: string;
}

/** View-model for a card in the Matches list. */
export interface MatchListItem {
  id: string;
  title: string;
  status: MatchStatus;
  players: MatchPlayer[];
  /** Undefined when no player has a level — see `MatchPlayer.level`. */
  avgLevel?: number;
  capacity: number;
  /** Persian month label, e.g. "بهمن ۱۴۰۴". */
  date: string;
  /** Tehran calendar date, ISO "YYYY-MM-DD" — matched against the date strip. */
  day: string;
  /** Start, epoch ms (`matchStartMs` of the API value). Orders
   *  the list; `day` alone can't separate two matches on the same afternoon. */
  startMs: number;
  /** Club name, resolved from the clubs list. Undefined if that lookup failed. */
  club?: string;
  /**
   * Toman, integer. Undefined for an API match: pricing arrives after the MVP,
   * and the wizard stopped asking for a fee on 2026-08-12. The card's CTA falls
   * back to a plain label so it never implies the match is free.
   */
  price?: number;
}

export interface DayOption {
  id: string;
  /** Day of month, Latin digits — converted for display. */
  day: number;
  weekday: string;
  /** Dates before today render dimmed. */
  past?: boolean;
}

export interface League {
  id: string;
  name: string;
  sport: Sport;
  startDate: string;
  endDate: string;
  location: string;
  skillLevel: SkillLevel;
  teamsCount: number;
  maxTeams: number;
  registrationOpen: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  sport: Sport;
  date: string;
  location: string;
  format: string;
  prizePool?: string;
  registrationOpen: boolean;
  registeredTeams: number;
  maxTeams: number;
}

/** View-model for a card in the Tournaments list. */
export interface TournamentListItem {
  id: string;
  title: string;
  status: MatchStatus;
  poster: string;
  /** Teams registered / capacity, pre-formatted Persian, e.g. "۲۱/۲ تیم". */
  teams: string;
  /** Toman, integer. */
  prize: number;
  /** Persian date range, e.g. "۱۵-۱۷ آذر ۱۴۰۴". */
  startDate: string;
  /** e.g. "لول ۳" — pre-formatted. */
  level: string;
  organizer: string;
  /** Entry fee, Toman, integer. */
  entryFee: number;
}

/** A bottom action on an Activity card. */
export interface ActivityAction {
  label: string;
  variant: "outline" | "filled";
  /** What tapping it does. The page owns the mutations; the data layer only
   *  names the intent, so a card stays serialisable. */
  kind: "accept-invite" | "decline-invite" | "open-match";
}

/** One meta line on an Activity card; tone drives its color/weight. */
export interface ActivityMetaLine {
  text: string;
  /** strong = bold ink · muted = secondary · faint = tertiary (renders as muted per gray-ramp rule). */
  tone: "strong" | "muted" | "faint";
}

/** View-model for a card on the Activity list. */
export interface ActivityItem {
  /** What the card is. Only an invitation can be answered, and only invitations
   *  count toward the nav's red dot — a match you are already in is not news. */
  kind: "invitation" | "match";
  /** The invitation id for an invite card; the match id for a match card. */
  id: string;
  /** Where «مشاهده مَچ» goes, and what the card is about. */
  matchId: string;
  image: string;
  /** Overlay label on the thumbnail, e.g. "در انتظار واریز". */
  status: string;
  /** Title parts; two parts render with a vertical separator between them. */
  title: string[];
  meta: ActivityMetaLine[];
  /** One or two bottom actions. */
  actions: ActivityAction[];
}

/** A titled group of Activity cards. `heading` omitted for the first (untitled) group. */
export interface ActivitySection {
  heading?: { right?: string; left?: string };
  items: ActivityItem[];
}

export interface Court {
  id: string;
  name: string;
  sport: Sport[];
  location: string;
  pricePerHour: number;
  rating: number;
  availableSlots: string[];
}

/** Match Details page (/matches/[id]) */
/** `cancelled` is the match's own status; the other three are clock arithmetic. */
export type MatchDetailsStatus = "upcoming" | "live" | "finished" | "cancelled";
export type ViewerRole = "creator" | "player";
/** Where the viewer stands in the match they're looking at. */
export type ViewerParticipation = "none" | "requested" | "confirmed";

export interface JoinRequest {
  /** The *participant* id — what approve/reject is addressed to, not an account id. */
  id: string;
  name: string;
  /** No API source: levels ship after the MVP. */
  level?: number;
  /** Preferred side, e.g. "راست". `MatchParticipantResponse` doesn't carry it. */
  side?: string;
  avatar?: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/** Create-match wizard (/matches/create) */
export interface CourtOption {
  id: string;
  club: string;
  /** Human-readable address, e.g. "کرج، عظیمیه، میدان استاندارد". */
  location: string;
  /** Club coordinates from the API. Optional — a club row may have neither. */
  lat?: number;
  lng?: number;
}

/**
 * A teammate added in the create-match wizard: either someone already on Patch
 * (an index into the pickable-players list) or a phone number we'll invite by
 * SMS. Held as a plain list, capped per format by `maxTeammates`.
 */
export type Teammate =
  | { kind: "player"; index: number }
  | { kind: "invite"; phone: string };

/**
 * Teammates allowed besides the creator. The API enforces each format's size
 * (`GET /match-formats`, 2026-09-26): OPEN_MATCH — رقابتی and دوستانه — is
 * exactly 4, AMERICANO at most 12. Counts the creator as on court either way.
 */
export function maxTeammates(format: CreateMatchDraft["format"]): number {
  return format === "americano" ? 11 : 3;
}

/** Draft state collected across the 5 wizard steps. */
export interface CreateMatchDraft {
  // ۱ مشخصات
  format: "americano" | "friendly" | "competitive" | null;
  title: string;
  description: string;
  invite: "public" | "private" | null;
  // ۲ مکان
  /** Whether the user has already reserved a court (required to proceed). */
  reserved: boolean | null;
  /** The reserved court; set when reserved === true. */
  courtId: string | null;
  // ۳ زمان‌بندی
  /** Picked day as ISO gregorian "YYYY-MM-DD" (displayed in jalali). */
  date: string | null;
  /** Start time "HH:MM" (24h, Latin). */
  time: string | null;
  /** Duration in minutes. */
  duration: number | null;
  // ۴ بازیکنان
  myRole: "captain" | "player" | null;
  /** Added teammates, in the order they were added. */
  teammates: Teammate[];
  /**
   * Which teammate is the برگزار کننده (مربی), as an index into `teammates`.
   * Only meaningful when `myRole === "player"` — a captain creator is the coach
   * themselves, so it's forced back to null then. Optional: a match can have no
   * coach at all.
   */
  coach: number | null;
}

/** View-model for the Match Details page. */
export interface MatchDetails {
  id: string;
  title: string;
  /**
   * The organizer's **account** id — compare with `getAccountId()` to decide the
   * viewer's role. Not `PlayerResponse.id`; the API keeps two id spaces.
   */
  organizerAccountId: string;
  /** Derived from the clock, not asked for — see `toDetailsStatus`. */
  stage: MatchDetailsStatus;
  /**
   * Whether the viewer is in this match. Drives the CTA: someone who has never
   * asked to join must not be offered «لغو ارسال درخواست ورود».
   */
  viewerParticipation: ViewerParticipation;
  /** The viewer's own participant id, for leaving. Absent when not involved. */
  viewerParticipantId?: string;
  /**
   * Whether joining waits for the organizer (`joinPolicy: MANUAL_APPROVE`). On
   * every other policy the API confirms on the spot, so the CTA must not promise
   * a request — observed 2026-09-19: «درخواست ورود» joined immediately.
   */
  needsApproval: boolean;
  /** Toman, integer. Undefined until pricing ships (post-MVP), like `price`. */
  fee?: number;
  /** e.g. "آمریکانو" */
  format: string;
  club: string;
  capacity: number;
  filled: number;
  creator: string;
  /** Persian date, e.g. "۱۷ بهمن". */
  date: string;
  /** Signup deadline, e.g. "۱۵ بهمن". No API field — omitted for a live match. */
  deadline?: string;
  /** e.g. "۱۴:۰۰ الی ۱۵:۴۵". */
  timeRange: string;
  description: string;
  players: MatchPlayer[];
  /** Entry restriction, e.g. "بالای لول ۳". Level-based, so it waits on levels. */
  restriction?: string;
  /** Banner text inside the court card. No API field. */
  courtNote?: string;
  /** The share link's token, from the API. Absent on a match the viewer did not
   *  create — only the organizer's own fetch carries one worth sharing. */
  inviteToken?: string;
  /** Court coordinates — drive the map and the مسیریابی link. */
  courtLat?: number;
  courtLng?: number;
  /** The club's own logo, from `ClubResponse.logoUrl`. Every seeded club has one. */
  clubLogo?: string;
  /** The club's contact number — a tap-to-call row, not a player's number. */
  clubPhone?: string;
  /** Banner text under the players grid. No API field. */
  teamNote?: string;
  faq: FaqEntry[];
  requests: JoinRequest[];
}
