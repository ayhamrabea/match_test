import type { KnownMatchStatus, Match } from '../types/match';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

export const FILTER_LABELS: Record<MatchFilter, string> = {
  all: 'Все',
  upcoming: 'Предстоящие',
  finished: 'Завершённые',
};

const STATUS_LABELS: Record<KnownMatchStatus, string> = {
  scheduled: 'Запланирован',
  live: 'Идёт',
  finished: 'Завершён',
  postponed: 'Перенесён',
  cancelled: 'Отменён',
};

// В «Предстоящие» — всё, что ещё будет сыграно или доиграно: live, перенесённые.
// В «Завершённые» — то, что больше не изменится, включая отменённые.
// Неизвестный статус не угадываем: такой матч виден только во «Все».
const STATUS_CATEGORY: Record<KnownMatchStatus, Exclude<MatchFilter, 'all'>> = {
  scheduled: 'upcoming',
  live: 'upcoming',
  postponed: 'upcoming',
  finished: 'finished',
  cancelled: 'finished',
};

function isKnownStatus(status: string): status is KnownMatchStatus {
  return status in STATUS_LABELS;
}

export function matchesFilter(match: Match, filter: MatchFilter): boolean {
  if (filter === 'all') return true;
  return isKnownStatus(match.status) && STATUS_CATEGORY[match.status] === filter;
}

export function matchesQuery(match: Match, query: string): boolean {
  const normalized = query.trim().toLocaleLowerCase('ru-RU');
  if (!normalized) return true;
  return [match.home.name, match.away.name].some((name) =>
    name.toLocaleLowerCase('ru-RU').includes(normalized),
  );
}

export function formatStatus(match: Match): string {
  if (!isKnownStatus(match.status)) return `Статус: ${match.status}`;
  const label = STATUS_LABELS[match.status];
  // minute !== null, а не truthy: 0-я минута тоже минута.
  return match.status === 'live' && match.minute !== null ? `${label} · ${match.minute}′` : label;
}

// Без timeZone в опциях Intl берёт часовой пояс устройства.
const startsAtFormat = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatStartsAt(startsAt: Date | null): string {
  return startsAt ? startsAtFormat.format(startsAt) : 'Дата пока не назначена';
}
