import React, { forwardRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export interface AuthInputProps extends TextInputProps {
  label: string;
  labelColor: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  secureToggle?: boolean;
  placeholderTextColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

function AuthInputBase(
  {
    label,
    labelColor,
    textColor,
    backgroundColor,
    borderColor,
    secureToggle = false,
    placeholderTextColor = '#4b5563',
    containerStyle,
    labelStyle,
    style: inputStyle,
    ...restProps
  }: AuthInputProps,
  ref: React.Ref<TextInput>,
) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { secureTextEntry, ...inputProps } = restProps;

  const toggleEnabled = Boolean(secureToggle);
  const effectiveSecureTextEntry = toggleEnabled
    ? !isPasswordVisible
    : secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: labelColor }, labelStyle]}>
        {label}
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              color: textColor,
              backgroundColor,
              borderColor,
            },
            inputStyle,
          ]}
          accessibilityLabel={label}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={effectiveSecureTextEntry}
          {...inputProps}
        />
        {toggleEnabled && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            hitSlop={10}
          >
            <FontAwesome
              name={isPasswordVisible ? 'eye-slash' : 'eye'}
              size={18}
              color="rgba(160, 174, 192, 0.8)"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
});

const AuthInput = forwardRef<TextInput, AuthInputProps>(AuthInputBase);
AuthInput.displayName = 'AuthInput';

export default AuthInput;
