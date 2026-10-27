import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FilterTabs } from '../components/FilterTabs';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useFavorites } from '../hooks/useFavorites';
import { useMatches } from '../hooks/useMatches';
import type { Match } from '../types/match';
import {
  FILTER_LABELS,
  matchesFilter,
  matchesQuery,
  type MatchFilter,
} from '../utils/matchPresentation';

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { data, loading, refreshing, error, updatedAt, reload } = useMatches();
  const { favorites, isFavorite, toggle } = useFavorites();
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [query, setQuery] = useState('');

  const visibleMatches = useMemo(
    () =>
      (data?.matches ?? []).filter(
        (match) => matchesFilter(match, filter) && matchesQuery(match, query),
      ),
    [data, filter, query],
  );

  const renderItem = useCallback(
    ({ item }: { item: Match }) => (
      <MatchCard match={item} favorite={isFavorite(item.id)} onToggleFavorite={toggle} />
    ),
    [isFavorite, toggle],
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Загружаем матчи…</Text>
      </View>
    );
  }

  // Ошибка без данных — на весь экран. Если список уже был, показываем его с баннером ниже.
  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{error}</Text>
        <Button title="Повторить" onPress={reload} />
      </View>
    );
  }

  const title = data.round !== null ? `Матчи ${data.round} тура` : 'Матчи тура';
  const emptyText =
    data.matches.length === 0
      ? 'В этом туре пока нет матчей.'
      : query.trim()
        ? `Нет матчей по запросу «${query.trim()}».`
        : `Нет матчей в категории «${FILTER_LABELS[filter]}».`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {updatedAt && <UpdatedAgo since={updatedAt} />}
        </View>
        {/* Pull-to-refresh в браузере не работает, поэтому есть и явная кнопка. */}
        <Button title={refreshing ? 'Обновляем…' : 'Обновить'} onPress={reload} disabled={refreshing} />
      </View>

      {error && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{error}</Text>
        </View>
      )}

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Поиск по клубу"
        placeholderTextColor="#9ca3af"
        autoCorrect={false}
        clearButtonMode="while-editing"
        style={styles.search}
      />

      <FilterTabs value={filter} onChange={setFilter} />

      <FlatList
        data={visibleMatches}
        keyExtractor={(match) => match.id}
        renderItem={renderItem}
        extraData={favorites}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} />}
        ListEmptyComponent={<Text style={styles.message}>{emptyText}</Text>}
        contentContainerStyle={visibleMatches.length === 0 && styles.emptyList}
      />
    </View>
  );
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

function Button({ title, onPress, disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={[styles.button, disabled && styles.buttonDisabled]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  message: {
    marginVertical: 12,
    fontSize: 16,
    textAlign: 'center',
    color: '#4b5563',
  },
  banner: {
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  bannerText: {
    color: '#b91c1c',
  },
  search: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#111827',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
