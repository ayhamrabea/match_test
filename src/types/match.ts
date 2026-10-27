export type Team = {
  id: string;
  name: string;
  city: string | null;
};

export type Score = {
  home: number;
  away: number;
};

// Статусы, которые экран умеет показывать. Сервер может прислать и другой —
// тогда в Match.status останется исходная строка.
export type KnownMatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';

export type Match = {
  id: string;
  // null — дата не назначена (например, у перенесённого матча).
  startsAt: Date | null;
  status: KnownMatchStatus | (string & {});
  // Минута матча, только для live.
  minute: number | null;
  home: Team;
  away: Team;
  // null — счёта ещё нет. 0:0 — это счёт, а не его отсутствие.
  score: Score | null;
};

export type MatchesResponse = {
  round: number | null;
  matches: Match[];
};
