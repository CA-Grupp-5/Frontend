import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useForm, Controller } from 'react-hook-form';
import { useColorScheme } from 'nativewind';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/stores/authStore';
import Ornaments from './Ornaments';
import AuthHeader from './AuthHeader';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import LoginOptionsRow from './LoginOptionsRow';

type AuthFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

function AuthForm() {
  const { colorScheme } = useColorScheme();
  const scheme = (colorScheme ?? 'light') as 'light' | 'dark';
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const loginGuest = useAuthStore((state) => state.loginGuest);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
  } = useForm<AuthFormValues>({
    defaultValues: {
      email: 'anders@gmail.com',
      password: '',
      rememberMe: false,
    },
  });

  const cardColors = Colors[scheme];
  const rememberMe = watch('rememberMe');

  const inputBorderColor = 'rgba(74, 85, 104, 0.8)';
  const placeholderTextColor = scheme === 'light' ? Colors.light.mutedText : '#cbd5e1';
  const inactiveCheckboxBorderColor = 'rgba(160, 174, 192, 0.5)';
  // Sign in button is ugly still, will keep for dev and use guest button as main in prod
  const primaryButtonTextColor = scheme === 'dark' ? '#000000' : '#111827';

  const onSubmit = handleSubmit(async ({ email, password, rememberMe }) => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password, rememberMe);
      if (!success) {
        Alert.alert('Error', 'Invalid password');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  });

  const handleGuestLogin = () => {
    loginGuest();
  };

  const toggleRememberMe = () => {
    setValue('rememberMe', !rememberMe, { shouldDirty: true });
  };

  return (
    <View style={styles.screen} className="flex-1 bg-palette-gray-50 dark:bg-palette-gray-900">
      <StatusBar style="light" />
      <Ornaments />

      <SafeAreaView style={styles.safeArea} className="flex-1 justify-center items-center px-4">
        <View style={styles.cardWrapper}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: cardColors.surface,
                borderLeftColor: cardColors.tint,
                shadowColor: '#000',
              },
            ]}
          >
            <View
              style={[
                styles.accentDot,
                { backgroundColor: cardColors.tint, shadowColor: cardColors.tint },
              ]}
            />

            <AuthHeader
              textColor={cardColors.text}
              subtextColor={cardColors.mutedText}
              borderColor={cardColors.tint}
            />

            <Controller
              control={control}
              name="email"
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthInput
                  label="Email"
                  labelColor={cardColors.mutedText}
                  textColor={cardColors.text}
                  backgroundColor={cardColors.inputBackground}
                  borderColor={inputBorderColor}
                  placeholder="Enter your email"
                  placeholderTextColor={placeholderTextColor}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthInput
                  label="Password"
                  labelColor={cardColors.mutedText}
                  textColor={cardColors.text}
                  backgroundColor={cardColors.inputBackground}
                  borderColor={inputBorderColor}
                  placeholder="Enter your password"
                  placeholderTextColor={placeholderTextColor}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureToggle
                  autoComplete="password"
                  style={styles.passwordInput}
                />
              )}
            />

            <LoginOptionsRow
              rememberMe={rememberMe}
              onToggleRememberMe={toggleRememberMe}
              accentColor={cardColors.tint}
              textColor={cardColors.mutedText}
              inactiveBorderColor={inactiveCheckboxBorderColor}
            />

            <AuthButton
              label="Sign In"
              loadingLabel="Signing In..."
              isLoading={isLoading}
              onPress={onSubmit}
              backgroundColor={cardColors.tint}
              textColor={primaryButtonTextColor}
            />

            <AuthButton
              label="Continue as Guest"
              variant="outline"
              onPress={handleGuestLogin}
              borderColor={cardColors.tint}
              textColor={cardColors.text}
              disabled={isLoading}
              style={styles.guestButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    position: 'relative',
  },
  safeArea: {
    width: '100%',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    paddingHorizontal: 16,
    position: 'relative',
    zIndex: 10,
  },
  card: {
    padding: 32,
    borderLeftWidth: 4,
    borderTopRightRadius: 48,
    borderBottomRightRadius: 48,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
  accentDot: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 16,
    height: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  passwordInput: {
    paddingRight: 48,
  },
  guestButton: {
    marginTop: 12,
  },
});

export default AuthForm;
