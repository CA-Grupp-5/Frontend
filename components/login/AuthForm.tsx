import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { useAlert } from '@/hooks/useAlert';
import { loginSchema, signupSchema, type AuthFormValues } from '@/lib/authValidation';

export type AuthMode = 'login' | 'signup';

export interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (nextMode: AuthMode) => void;
}

export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const isLogin = mode === 'login';
  const { colorScheme } = useColorScheme();
  const scheme = (colorScheme ?? 'light') as 'light' | 'dark';
  const insets = useSafeAreaInsets();
  const login = useAuthStore((state) => state.login);
  const loginGuest = useAuthStore((state) => state.loginGuest);
  const { alert } = useAlert();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState,
  } = useForm<AuthFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const isLoading = formState.isSubmitting;

  const cardColors = Colors[scheme];
  const rememberMe = watch('rememberMe');

  const inputBorderColor = 'rgba(74, 85, 104, 0.8)';
  const placeholderTextColor = scheme === 'light' ? Colors.light.mutedText : '#cbd5e1';
  const inactiveCheckboxBorderColor = 'rgba(160, 174, 192, 0.5)';
  const primaryButtonTextColor = scheme === 'dark' ? '#000000' : '#111827';

  const onSubmit = handleSubmit(
    async (values) => {
      const schema = isLogin ? loginSchema : signupSchema;
      const validationResult = schema.safeParse(values);

      if (!validationResult.success) {
        const [firstIssue] = validationResult.error.issues;
        await alert('Error', firstIssue?.message ?? 'Please check your details and try again.');
        return;
      }

      const { name, email, password, rememberMe } = validationResult.data;
      const normalizedName = name ?? '';

      try {
        if (isLogin) {
          const success = await login(email, password, rememberMe);
          if (!success) {
            await alert('Error', 'Invalid password');
            // Clear only the password field on invalid sign-in
            setValue('password', '', { shouldDirty: false });
            return;
          }
        } else {
          const { register } = await import('@/lib/api');
          await register(normalizedName, email, password);
          await alert('Account created', 'You can now log in with your new credentials.');
          onModeChange('login');
          setValue('password', '', { shouldDirty: false });
          setValue('name', '', { shouldDirty: false });
        }
      } catch (error) {
        console.log(error);
        const message =
          error instanceof Error && error.message
            ? error.message
            : 'Something went wrong. Please try again.';
        await alert('Error', message);
        return;
      }
    },
    async (errors) => {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        await alert('Error', firstError.message);
        return;
      }

      await alert('Error', 'Please check your details and try again.');
    },
  );

  const handleGuestLogin = () => {
    loginGuest();
  };

  const toggleRememberMe = () => {
    setValue('rememberMe', !rememberMe, { shouldDirty: true });
  };

  // Clear all form fields whenever switching between login/signup modes
  React.useEffect(() => {
    reset({ name: '', email: '', password: '', rememberMe: false });
  }, [mode, reset]);

  

  return (
    <View style={styles.screen} className="flex-1 bg-palette-gray-50 dark:bg-palette-gray-900">
      <StatusBar style="auto" />
      <Ornaments />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea} className="flex-1">
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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
                  title={isLogin ? 'Welcome back' : 'Create your account'}
                  subtitle={
                    isLogin
                      ? 'Sign in to your deliveries to continue'
                      : 'Sign up to start managing your deliveries'
                  }
                />

                {!isLogin ? (
                  <Controller
                    control={control}
                    name="name"
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <AuthInput
                        label="Full name"
                        labelColor={cardColors.mutedText}
                        textColor={cardColors.text}
                        backgroundColor={cardColors.inputBackground}
                        borderColor={inputBorderColor}
                        placeholder="Enter your name"
                        placeholderTextColor={placeholderTextColor}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="words"
                        autoComplete="name"
                      />
                    )}
                  />
                ) : null}

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

                {isLogin ? (
                  <LoginOptionsRow
                    rememberMe={rememberMe}
                    onToggleRememberMe={toggleRememberMe}
                    accentColor={cardColors.tint}
                    textColor={cardColors.mutedText}
                    inactiveBorderColor={inactiveCheckboxBorderColor}
                    style={styles.loginOptions}
                  />
                ) : null}

                <AuthButton
                  label={isLogin ? 'Sign In' : 'Create Account'}
                  variant="outline"
                  loadingLabel={isLogin ? 'Signing In...' : 'Creating Account...'}
                  isLoading={isLoading}
                  onPress={onSubmit}
                  backgroundColor={cardColors.background}
                  textColor={cardColors.text}
                  style={styles.primaryButton}
                  borderColor={cardColors.tint}

                />

                {isLogin ? (
                  <AuthButton
                    label="Continue as Guest"
                    variant="outline"
                    onPress={handleGuestLogin}
                    borderColor={cardColors.tint}
                    textColor={cardColors.text}
                    disabled={isLoading}
                    style={styles.guestButton}
                  />
                ) : null}

                <View style={styles.switchModeRow}>
                  <Text style={[styles.switchText, { color: cardColors.mutedText }]}>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => onModeChange(isLogin ? 'signup' : 'login')}
                    disabled={isLoading}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.switchLink, { color: cardColors.text }]}>
                      {isLogin ? 'Sign up' : 'Log in'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  loginOptions: {
    marginTop: 16,
  },
  guestButton: {
    marginTop: 12,
  },
  primaryButton: {
    marginTop: 24,
  },
  switchModeRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

  
