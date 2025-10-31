import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors, { Palette, ThemeName } from '@/constants/Colors';

type ViewMode = 'grid' | 'card' | 'list';

type Props = {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  scheme: ThemeName;
};

const OPTIONS: Array<[ViewMode, React.ComponentProps<typeof FontAwesome>['name']]> = [
  ['grid', 'th'],
  ['card', 'clone'],
  ['list', 'list'],
];

export default function ViewModeSelector({ mode, onChange, scheme }: Props) {
  const text = Colors[scheme].text;
  const tint = Colors[scheme].tint;
  const border = Colors[scheme].border;
  const muted = Colors[scheme].mutedText;
  

  return (
    <View style={[styles.container, { borderBottomColor: Colors[scheme].divider }]}> 
      <Text style={[styles.label, { color: muted }]}>View:</Text>
      {OPTIONS.map(([m, icon]) => {
        const active = mode === m;
        return (
          <Pressable
            key={m}
            onPress={() => onChange(m)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Set view to ${m}`}
            style={[
              styles.option,
              active
                ? { backgroundColor: tint, borderWidth: 0 }
                : { borderColor: border, borderWidth: 1 },
            ]}
          >
            <FontAwesome name={icon} size={14} color={active ? Palette.black : text} />
            <Text style={[
              styles.optionText,
              { color: active ? Palette.black : Colors[scheme].text },
            ]}>{m}</Text>
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
    textTransform: 'capitalize',
  },
});
