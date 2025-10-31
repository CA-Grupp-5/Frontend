import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Colors, {Palette, ThemeName } from '@/constants/Colors';

export type StatusFilter = 'all' | 'alert' | 'in_range';

type Props = {
  filter: StatusFilter;
  onChange: (f: StatusFilter) => void;
  scheme: ThemeName;
};

const OPTIONS: Array<{ key: StatusFilter; label: string }>= [
  { key: 'all', label: 'All' },
  { key: 'alert', label: 'Alerts' },
  { key: 'in_range', label: 'In range' },
];

export default function FilterBar({ filter, onChange, scheme }: Props) {
  const text = Colors[scheme].text;
  const tint = Colors[scheme].tint;
  const border = Colors[scheme].border;
  const muted = Colors[scheme].mutedText;

  return (
    <View style={[styles.container, { borderBottomColor: Colors[scheme].divider }]}> 
      <Text style={[styles.label, { color: muted }]}>Filter:</Text>
      {OPTIONS.map((opt) => {
        const active = filter === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            accessibilityRole="button"
            accessibilityLabel={`Set filter to ${opt.label}`}
            hitSlop={10}
            style={[
              styles.option,
              active
                ? { backgroundColor: tint, borderWidth: 0 }
                : { borderColor: border, borderWidth: 1 },
            ]}
          >
            <Text style={[styles.optionText, { color: active ? Palette.black : text }]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  label: {
    marginRight: 6,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  optionText: {
    fontWeight: '600',
  },
});
