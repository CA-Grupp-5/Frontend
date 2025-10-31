import React from 'react';
import { View, TextInput, Pressable, StyleSheet, TextInputProps } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors, {ThemeName } from '@/constants/Colors';
type Props = {
  value: string;
  onChangeText: (text: string) => void;
  scheme: ThemeName;
  placeholder?: string;
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>;
};

export default function SearchBar({ value, onChangeText, scheme, placeholder = 'Search by package ID', inputProps }: Props) {
  const text = Colors[scheme].text;
  const muted = Colors[scheme].mutedText;
  const border = Colors[scheme].border;
  const inputBg = Colors[scheme].inputBackground ?? Colors[scheme].surface;

  return (
    <View style={[styles.container, { borderBottomColor: Colors[scheme].divider }]}> 
      <View style={[styles.inputWrapper, { backgroundColor: inputBg, borderColor: border }]}> 
        <FontAwesome name="search" size={16} color={muted} />
        <TextInput
          style={[styles.input, { color: text }]}
          placeholder={placeholder}
          placeholderTextColor={muted}
          value={value}
          onChangeText={onChangeText}
          accessibilityLabel="Search packages"
          autoCapitalize="none"
          autoCorrect={false}
          {...inputProps}
        />
        {value?.length > 0 && (
          <Pressable
            onPress={() => onChangeText('')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            style={styles.clearBtn}
          >
            <FontAwesome name="close" size={14} color={muted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    
  },
  input: {
    flex: 1,
    paddingVertical: 0, 
  },
  clearBtn: {
    paddingLeft: 6,
    
  },
});

