import type {
  Player,
  Match,
  League,
  Tournament,
  Court,
  MatchListItem,
  DayOption,
} from "@/lib/types";

const AVATAR = "/images/avatar-placeholder.svg";

/** Horizontal date strip in the Matches header (۱۵–۲۱ بهمن). */
export const matchDays: DayOption[] = [
  { id: "d15", day: 15, weekday: "شنبه", past: true },
  { id: "d16", day: 16, weekday: "یکشنبه", past: true },
  { id: "d17", day: 17, weekday: "دوشنبه" },
  { id: "d18", day: 18, weekday: "سه‌شنبه" },
  { id: "d19", day: 19, weekday: "چهارشنبه" },
  { id: "d20", day: 20, weekday: "پنج‌شنبه" },
  { id: "d21", day: 21, weekday: "جمعه" },
];

function squad(count: number): MatchListItem["players"] {
  return Array.from({ length: count }, () => ({
    name: "سینا عضافی",
    level: 3,
    avatar: AVATAR,
  }));
}

/** Cards shown on the Matches list page. */
export const matchList: MatchListItem[] = [
  {
    id: "ml1",
    title: "راکت طلایی",
    status: "active",
    players: squad(6),
    avgLevel: 3,
    capacity: 20,
    date: "بهمن ۱۴۰۴",
    price: 5_250_000_000,
  },
  {
    id: "ml2",
    title: "راکت طلایی",
    status: "active",
    players: squad(6),
    avgLevel: 3,
    capacity: 20,
    date: "بهمن ۱۴۰۴",
    price: 5_250_000_000,
  },
  {
    id: "ml3",
    title: "راکت طلایی",
    status: "active",
    players: squad(6),
    avgLevel: 3,
    capacity: 20,
    date: "بهمن ۱۴۰۴",
    price: 5_250_000_000,
  },
];

export const players: Player[] = [
  { id: "p1", name: "Sara Ahmadi", avatar: "", sport: ["padel"], skillLevel: "intermediate", location: "Tehran" },
  { id: "p2", name: "Reza Karimi", avatar: "", sport: ["padel", "tennis"], skillLevel: "advanced", location: "Tehran" },
  { id: "p3", name: "Mina Hosseini", avatar: "", sport: ["tennis"], skillLevel: "beginner", location: "Tehran" },
  { id: "p4", name: "Ali Moradi", avatar: "", sport: ["padel"], skillLevel: "intermediate", location: "Tehran" },
];

export const matches: Match[] = [
  {
    id: "m1",
    sport: "padel",
    date: "2026-06-03",
    time: "18:00",
    location: "Saadat Abad, Tehran",
    courtName: "Court A",
    skillLevel: "intermediate",
    totalSpots: 4,
    filledSpots: 2,
    players: [players[0], players[1]],
    host: players[0],
    pricePerPlayer: 150000,
  },
  {
    id: "m2",
    sport: "tennis",
    date: "2026-06-04",
    time: "09:00",
    location: "Niavaran, Tehran",
    courtName: "Court 2",
    skillLevel: "beginner",
    totalSpots: 2,
    filledSpots: 1,
    players: [players[2]],
    host: players[2],
    pricePerPlayer: 120000,
  },
  {
    id: "m3",
    sport: "padel",
    date: "2026-06-03",
    time: "20:00",
    location: "Jordan, Tehran",
    courtName: "VIP Court",
    skillLevel: "advanced",
    totalSpots: 4,
    filledSpots: 3,
    players: [players[1], players[3], players[0]],
    host: players[1],
    pricePerPlayer: 200000,
  },
];

export const leagues: League[] = [
  {
    id: "l1",
    name: "Tehran Padel League — Summer",
    sport: "padel",
    startDate: "2026-06-10",
    endDate: "2026-08-10",
    location: "Tehran",
    skillLevel: "intermediate",
    teamsCount: 6,
    maxTeams: 8,
    registrationOpen: true,
  },
  {
    id: "l2",
    name: "Capital Tennis Series",
    sport: "tennis",
    startDate: "2026-06-15",
    endDate: "2026-07-15",
    location: "Tehran",
    skillLevel: "advanced",
    teamsCount: 4,
    maxTeams: 4,
    registrationOpen: false,
  },
];

export const tournaments: Tournament[] = [
  {
    id: "t1",
    name: "Patch Open — Padel",
    sport: "padel",
    date: "2026-06-20",
    location: "Saadat Abad, Tehran",
    format: "Double Elimination",
    prizePool: "10,000,000 تومان",
    registrationOpen: true,
    registeredTeams: 10,
    maxTeams: 16,
  },
  {
    id: "t2",
    name: "Tehran Tennis Cup",
    sport: "tennis",
    date: "2026-07-05",
    location: "Niavaran, Tehran",
    format: "Single Elimination",
    registrationOpen: true,
    registeredTeams: 5,
    maxTeams: 8,
  },
];

export const courts: Court[] = [
  {
    id: "c1",
    name: "Star Padel Club",
    sport: ["padel"],
    location: "Saadat Abad, Tehran",
    pricePerHour: 300000,
    rating: 4.7,
    availableSlots: ["09:00", "11:00", "18:00", "20:00"],
  },
  {
    id: "c2",
    name: "Niavaran Tennis Complex",
    sport: ["tennis"],
    location: "Niavaran, Tehran",
    pricePerHour: 250000,
    rating: 4.5,
    availableSlots: ["08:00", "10:00", "16:00"],
  },
  {
    id: "c3",
    name: "Elite Sports Hub",
    sport: ["padel", "tennis"],
    location: "Jordan, Tehran",
    pricePerHour: 350000,
    rating: 4.9,
    availableSlots: ["07:00", "09:00", "19:00", "21:00"],
  },
];
