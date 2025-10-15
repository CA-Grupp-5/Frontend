import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export interface LoginOptionsRowProps {
  rememberMe: boolean;
  onToggleRememberMe: () => void;
  onForgotPassword?: () => void;
  accentColor: string;
  textColor: string;
  inactiveBorderColor?: string;
  rememberLabel?: string;
  forgotLabel?: string;
  style?: StyleProp<ViewStyle>;
  rememberTextStyle?: StyleProp<TextStyle>;
  forgotTextStyle?: StyleProp<TextStyle>;
}

function LoginOptionsRow({
  rememberMe,
  onToggleRememberMe,
  onForgotPassword,
  accentColor,
  textColor,
  inactiveBorderColor = 'rgba(148, 163, 184, 0.6)',
  rememberLabel = 'Remember me',
  forgotLabel = 'Forgot password?',
  style,
  rememberTextStyle,
  forgotTextStyle,
}: LoginOptionsRowProps) {
  const checkboxStyles = [
    styles.checkboxBase,
    rememberMe ? styles.checkboxActive : styles.checkboxInactive,
    rememberMe ? { backgroundColor: accentColor, borderColor: accentColor } : { borderColor: inactiveBorderColor },
  ];

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.rememberButton} onPress={onToggleRememberMe} activeOpacity={0.85}>
        <View style={checkboxStyles}>{rememberMe && <FontAwesome name="check" size={10} color="#fff" />}</View>
        <Text style={[styles.rememberLabel, { color: textColor }, rememberTextStyle]}>{rememberLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onForgotPassword} disabled={!onForgotPassword} activeOpacity={0.85}>
        <Text style={[styles.forgotLabel, { color: textColor }, forgotTextStyle]}>{forgotLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  rememberButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBase: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 3,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: 'transparent',
  },
  checkboxInactive: {
    backgroundColor: 'transparent',
  },
  rememberLabel: {
    fontSize: 14,
  },
  forgotLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginOptionsRow;
