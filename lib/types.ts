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
  level: number;
  avatar?: string;
}

/** View-model for a card in the Matches list. */
export interface MatchListItem {
  id: string;
  title: string;
  status: MatchStatus;
  players: MatchPlayer[];
  avgLevel: number;
  capacity: number;
  /** Persian month label, e.g. "بهمن ۱۴۰۴". */
  date: string;
  /** Toman, integer. */
  price: number;
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
}

/** One meta line on an Activity card; tone drives its color/weight. */
export interface ActivityMetaLine {
  text: string;
  /** strong = bold ink · muted = secondary · faint = tertiary (renders as muted per gray-ramp rule). */
  tone: "strong" | "muted" | "faint";
}

/** View-model for a card on the Activity list. */
export interface ActivityItem {
  id: string;
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
export type MatchDetailsStatus = "upcoming" | "live" | "finished";
export type ViewerRole = "creator" | "player";

export interface JoinRequest {
  id: string;
  name: string;
  level: number;
  /** Preferred side, e.g. "راست". */
  side: string;
  avatar?: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/** View-model for the Match Details page. */
export interface MatchDetails {
  id: string;
  title: string;
  /** Toman, integer. */
  fee: number;
  /** e.g. "آمریکانو" */
  format: string;
  club: string;
  capacity: number;
  filled: number;
  creator: string;
  /** Persian date, e.g. "۱۷ بهمن". */
  date: string;
  /** Signup deadline, e.g. "۱۵ بهمن". */
  deadline: string;
  /** e.g. "۱۴:۰۰ الی ۱۵:۴۵". */
  timeRange: string;
  description: string;
  players: MatchPlayer[];
  /** Entry restriction, e.g. "بالای لول ۳". */
  restriction: string;
  /** Banner text inside the court card. */
  courtNote: string;
  /** Banner text under the players grid. */
  teamNote: string;
  faq: FaqEntry[];
  requests: JoinRequest[];
}
