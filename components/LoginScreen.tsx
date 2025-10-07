import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import { useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuthStore } from '@/stores/authStore';
import { Palette } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

// Complex styles that benefit from StyleSheet for performance
const styles = StyleSheet.create({
  orbitalRing1: {
    width: width * 1.2,
    height: width * 1.2,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.1)',
    borderRadius: width * 0.6,
  },
  orbitalRing2: {
    position: 'absolute',
    width: width,
    height: width,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.15)',
    borderRadius: width * 0.5,
  },
  orbitalRing3: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.2)',
    borderRadius: width * 0.4,
  },
  floatingSquare: {
    position: 'absolute',
    top: 80,
    left: 40,
    width: 24,
    height: 24,
    backgroundColor: 'rgba(66, 153, 225, 0.1)',
    borderRadius: 6,
    transform: [{ rotate: '45deg' }],
  },
  floatingCircle: {
    position: 'absolute',
    bottom: 160,
    right: 40,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(66, 153, 225, 0.2)',
  },
  floatingBorder: {
    position: 'absolute',
    top: height * 0.5,
    left: 0,
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.3)',
    borderRadius: 6,
  },
  floatingAccentDot: {
    position: 'absolute',
    top: -16,
    right: -16,
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputField: {
    borderWidth: 1,
    borderColor: 'rgba(74, 85, 104, 0.8)',
    borderRadius: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 3,
  },
  signInButton: {
    borderRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default function LoginScreen() {
  const { colorScheme } = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    // Removed for dev
    // if (!email.trim() || !password.trim()) {
    //   Alert.alert('Error', 'Please enter both email and password');
    //   return;
    // }

    setIsLoading(true);
    try {
      const success = await login(email, password, rememberMe);
      if (!success) {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = colorScheme === 'dark';
  
  // const bgColor = isDark ? Palette.gray900 : Palette.gray50;
  const cardBgColor = isDark ? Palette.darkCardBg : Palette.lightCardBg;
  const inputBgColor = isDark ? Palette.gray600 : Palette.gray200;
  const textColor = isDark ? Palette.white : Palette.gray900;
  const subtextColor = isDark ? Palette.gray400 : Palette.gray500;
  const borderColor = Palette.tint;
  const buttonColor = Palette.tint;

  return (
    <View className={`flex-1 ${isDark ? 'bg-palette-gray-900' : 'bg-palette-gray-50'}`}>
      <StatusBar style="light" />
      
      {/* Background with orbital rings */}
      <View className="absolute inset-0 items-center justify-center">
        <View style={styles.orbitalRing1} />
        <View style={styles.orbitalRing2} />
        <View style={styles.orbitalRing3} />
      </View>

      {/* Floating elements */}
      <View style={styles.floatingSquare} />
      <View style={styles.floatingCircle} />
      <View style={styles.floatingBorder} />

      <SafeAreaView className="flex-1 justify-center items-center px-4">
        {/* Asymmetric positioned card */}
        <View className="w-full max-w-sm self-center px-4 relative z-10">
          <View 
            className="p-8"
            style={{
              backgroundColor: cardBgColor,
              borderLeftWidth: 4,
              borderLeftColor: borderColor,
              borderTopRightRadius: 48,
              borderBottomRightRadius: 48,
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 20,
            }}
          >
            {/* Floating accent dot */}
            <View 
              style={[
                styles.floatingAccentDot,
                { backgroundColor: borderColor, shadowColor: borderColor }
              ]}
            />

            {/* Header with icon and title */}
            <View className="mb-8">
              <View className="flex-row items-center gap-4 mb-6">
                {/* Circular icon container */}
                <View 
                  className="items-center justify-center"
                  style={[
                    styles.iconContainer,
                    { backgroundColor: borderColor, shadowColor: borderColor }
                  ]}
                >
                  <Image
                    source={require('../assets/images/delivra-adaptive.png')}
                    style={{ width: 80, height: 80, resizeMode: 'contain' }}
                  />
                </View>
                <View>
                  <View className="flex-row items-center mb-1">
                    <Text className="text-2xl font-bold" style={{ color: textColor, letterSpacing: 2 }}>DELIVRA</Text>
                  </View>
                </View>
              </View>
              
              <Text className="text-3xl font-bold mb-2" style={{ color: textColor }}>Welcome back</Text>
              <Text className="text-base" style={{ color: subtextColor }}>Sign in to your deliveries to continue</Text>
            </View>

            {/* Email Field */}
            <View className="mb-5">
              <Text className="text-sm font-medium mb-2" style={{ color: subtextColor }}>Email</Text>
              <TextInput
                className="px-4 py-3.5 text-base"
                style={[
                  styles.inputField,
                  { backgroundColor: inputBgColor, color: textColor }
                ]}
                placeholder="Enter your email"
                placeholderTextColor="rgba(160, 174, 192, 0.6)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Field */}
            <View className="mb-5">
              <Text className="text-sm font-medium mb-2" style={{ color: subtextColor }}>Password</Text>
              <View className="relative">
                <TextInput
                  className="px-4 py-3.5 pr-12 text-base"
                  style={[
                    styles.inputField,
                    { backgroundColor: inputBgColor, color: textColor }
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(160, 174, 192, 0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={18}
                    color="rgba(160, 174, 192, 0.8)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View className="flex-row justify-between items-center mb-8">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  className="mr-2 items-center justify-center"
                  style={[
                    styles.checkbox,
                    {
                      borderColor: rememberMe ? borderColor : 'rgba(160, 174, 192, 0.5)',
                      backgroundColor: rememberMe ? borderColor : 'transparent',
                    }
                  ]}
                >
                  {rememberMe && (
                    <FontAwesome name="check" size={10} color="white" />
                  )}
                </View>
                <Text className="text-sm" style={{ color: subtextColor }}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text className="text-sm font-medium" style={{ color: borderColor }}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              className="py-4 items-center"
              style={[
                styles.signInButton,
                {
                  backgroundColor: buttonColor,
                  shadowColor: buttonColor,
                  opacity: isLoading ? 0.7 : 1,
                }
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white text-base font-semibold">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
