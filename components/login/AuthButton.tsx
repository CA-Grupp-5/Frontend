import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, TextStyle } from 'react-native';

export interface AuthButtonProps extends TouchableOpacityProps {
  label: string;
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: 'primary' | 'outline';
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  textStyle?: StyleProp<TextStyle>;
}

function AuthButton({
  label,
  isLoading = false,
  loadingLabel,
  variant = 'primary',
  backgroundColor,
  borderColor,
  textColor,
  textStyle,
  disabled,
  style,
  ...touchableProps
}: AuthButtonProps) {
  const resolvedBackgroundColor = variant === 'primary' ? (backgroundColor ?? '#FFFFFF') : 'transparent';
  const resolvedBorderColor = variant === 'outline' ? (borderColor ?? '#111827') : 'transparent';
  const resolvedTextColor = textColor ?? (variant === 'primary' ? '#111827' : resolvedBorderColor);
  const resolvedShadowColor = variant === 'primary' ? resolvedBackgroundColor : 'transparent';

  const isDisabled = Boolean(disabled || isLoading);
  const displayLabel = isLoading ? (loadingLabel ?? label) : label;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.outline,
        {
          backgroundColor: resolvedBackgroundColor,
          borderColor: resolvedBorderColor,
          shadowColor: resolvedShadowColor,
        },
        isDisabled ? styles.disabled : null,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.85}
      {...touchableProps}
    >
      <Text style={[styles.label, { color: resolvedTextColor }, textStyle]}>{displayLabel}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primary: {
    borderWidth: 0,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    shadowColor: 'transparent',
  },
  disabled: {
    opacity: 0.7,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthButton;
