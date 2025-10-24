import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface AuthHeaderProps {
  textColor: string;
  subtextColor: string;
  borderColor: string;
  style?: StyleProp<ViewStyle>;
}

function AuthHeader({ textColor, subtextColor, borderColor, style }: AuthHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        <View style={[styles.iconContainer, { backgroundColor: borderColor, shadowColor: borderColor }]}>
          <Image
            source={require('../../assets/images/delivra-adaptive.png')}
            style={styles.logo}
            accessible={false}
          />
        </View>
        <View style={styles.headingContainer}>
          <Text style={[styles.logoText, { color: textColor }]}>DELIVRA</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: textColor }]}>Welcome back</Text>
      <Text style={[styles.subtitle, { color: subtextColor }]}>
        Sign in to your deliveries to continue
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginRight: 16,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
});

export default AuthHeader;
