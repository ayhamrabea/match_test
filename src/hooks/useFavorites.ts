import { useCallback, useState } from 'react';

// Избранные матчи (по id). Хранятся только в памяти, пока открыто приложение.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // indexOf возвращает -1, если элемента нет, а Boolean(-1) === true —
  // поэтому раньше «горели» все звёзды. includes отвечает ровно на нужный вопрос.
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  // State нельзя мутировать: React сравнивает ссылки и на тот же массив
  // не перерисовывает. Всегда создаём новый массив от актуального значения.
  const toggle = useCallback((id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id],
    );
  }, []);

  return { favorites, isFavorite, toggle };
}
