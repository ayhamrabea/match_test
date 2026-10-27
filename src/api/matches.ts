import { MATCHES_URL } from '../config';
import type { Match, MatchesResponse, Score, Team } from '../types/match';

// Загружает матчи тура. Бросает ошибку, если сервер ответил не 2xx
// или прислал данные не того формата.
export async function fetchMatches(signal?: AbortSignal): Promise<MatchesResponse> {
  const response = await fetch(MATCHES_URL, { signal });
  if (!response.ok) {
    throw new Error(`Сервер ответил ${response.status}`);
  }
  const json: unknown = await response.json();
  return parseMatchesResponse(json);
}

export function parseMatchesResponse(json: unknown): MatchesResponse {
  if (!isObject(json) || !Array.isArray(json.matches)) {
    throw new Error('Неожиданный формат ответа');
  }
  const matches: Match[] = [];
  for (const raw of json.matches) {
    const match = parseMatch(raw);
    // Один битый матч не должен ронять весь список — пропускаем только его.
    if (match) {
      matches.push(match);
    } else {
      console.warn('Пропущен матч с некорректными данными', raw);
    }
  }
  return {
    round: typeof json.round === 'number' ? json.round : null,
    matches,
  };
}

function parseMatch(raw: unknown): Match | null {
  if (!isObject(raw) || typeof raw.id !== 'string') return null;
  const home = parseTeam(raw.home);
  const away = parseTeam(raw.away);
  if (!home || !away) return null;

  return {
    id: raw.id,
    startsAt: parseDate(raw.startsAt),
    status: typeof raw.status === 'string' ? raw.status : 'unknown',
    minute: typeof raw.minute === 'number' ? raw.minute : null,
    home,
    away,
    score: parseScore(raw.score),
  };
}

function parseTeam(raw: unknown): Team | null {
  if (!isObject(raw) || typeof raw.name !== 'string') return null;
  return {
    id: typeof raw.id === 'string' ? raw.id : raw.name,
    name: raw.name,
    city: typeof raw.city === 'string' ? raw.city : null,
  };
}

// Важно: new Date(null) — это 1 января 1970, а не «нет даты».
function parseDate(raw: unknown): Date | null {
  if (typeof raw !== 'string') return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Проверяем на число, а не на truthy: 0 — нормальный счёт.
function parseScore(raw: unknown): Score | null {
  if (!isObject(raw) || typeof raw.home !== 'number' || typeof raw.away !== 'number') {
    return null;
  }
  return { home: raw.home, away: raw.away };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
