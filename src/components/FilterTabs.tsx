import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FILTER_LABELS, type MatchFilter } from '../utils/matchPresentation';

type Props = {
  value: MatchFilter;
  onChange: (filter: MatchFilter) => void;
};

const FILTERS: MatchFilter[] = ['all', 'upcoming', 'finished'];

export function FilterTabs({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {FILTERS.map((filter) => {
        const selected = filter === value;
        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.tab, selected && styles.selectedTab]}
          >
            <Text style={[styles.text, selected && styles.selectedText]}>{FILTER_LABELS[filter]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  selectedTab: {
    backgroundColor: '#111827',
  },
  text: {
    color: '#374151',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
});
