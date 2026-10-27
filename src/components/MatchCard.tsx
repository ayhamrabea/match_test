import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Match } from '../types/match';
import { formatStartsAt, formatStatus } from '../utils/matchPresentation';
import { FavoriteButton } from './FavoriteButton';

type Props = {
  match: Match;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
};

export const MatchCard = memo(function MatchCard({ match, favorite, onToggleFavorite }: Props) {
  const { home, away, score } = match;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.status, match.status === 'live' && styles.live]}>
          {formatStatus(match)}
        </Text>
        <FavoriteButton active={favorite} onPress={() => onToggleFavorite(match.id)} />
      </View>

      <View style={styles.row}>
        <Text style={styles.team} numberOfLines={1}>{home.name}</Text>
        {/* score !== null, а не truthy-проверка: 0:0 — тоже счёт */}
        <Text style={styles.score}>{score ? `${score.home} : ${score.away}` : '– : –'}</Text>
        <Text style={[styles.team, styles.awayTeam]} numberOfLines={1}>{away.name}</Text>
      </View>

      <Text style={styles.date}>{formatStartsAt(match.startsAt)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 13,
    color: '#6b7280',
  },
  live: {
    color: '#ef3124',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  team: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  awayTeam: {
    textAlign: 'right',
  },
  score: {
    marginHorizontal: 12,
    fontSize: 20,
    fontWeight: '700',
  },
  date: {
    marginTop: 6,
    fontSize: 13,
    color: '#4b5563',
  },
});
