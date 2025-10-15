import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors, { ThemeName } from '@/constants/Colors';

type Props = {
  id: string;
  onPress: (id: string) => void;
  scheme: ThemeName;
  variant?: 'outline' | 'ghost';
};

export default React.memo(function HistoryButton({ id, onPress, scheme, variant = 'outline' }: Props) {
  const tint = Colors[scheme].tint;
  const text = Colors[scheme].text;
  return (
    <Pressable
      onPress={() => onPress(id)}
      accessibilityRole="button"
      accessibilityLabel={`View history for ${id}`}
      hitSlop={10}
      style={[
        variant === 'outline' ? styles.outline : styles.ghost,
        variant === 'outline' ? { borderColor: tint } : undefined,
      ]}
    >
      <FontAwesome name="history" size={14} color={tint} />
      <Text style={[styles.label, { color: text }]}>
        {variant === 'outline' ? 'View History' : 'History'}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  outline: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ghost: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  label: {
    fontWeight: '600',
    marginLeft: 6,
  },
});
