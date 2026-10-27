import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMatches } from '../api/matches';
import type { MatchesResponse } from '../types/match';

type State = {
  data: MatchesResponse | null;
  // Первая загрузка (данных ещё нет) — показываем спиннер на весь экран.
  loading: boolean;
  // Повторная загрузка поверх уже показанного списка.
  refreshing: boolean;
  error: string | null;
  // Момент последней успешной загрузки — для UpdatedAgo.
  updatedAt: Date | null;
};

export function useMatches() {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    refreshing: false,
    error: null,
    updatedAt: null,
  });
  const requestRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    // Новый запрос отменяет предыдущий, чтобы старый ответ не перетёр свежий.
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    setState((prev) => ({
      ...prev,
      loading: prev.data === null,
      refreshing: prev.data !== null,
      error: null,
    }));

    try {
      const data = await fetchMatches(controller.signal);
      if (controller.signal.aborted) return;
      setState({ data, loading: false, refreshing: false, error: null, updatedAt: new Date() });
    } catch (error) {
      if (controller.signal.aborted) return;
      console.warn('Не удалось загрузить матчи', error);
      // Уже загруженные данные не выбрасываем — экран покажет ошибку поверх них.
      setState((prev) => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: 'Не удалось загрузить матчи. Проверьте интернет и попробуйте ещё раз.',
      }));
    }
  }, []);

  useEffect(() => {
    void load();
    return () => requestRef.current?.abort();
  }, [load]);

  return { ...state, reload: load };
}
