import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

function Ornaments() {
  return (
    <>
      <View style={styles.ringsContainer}>
        <View style={styles.orbitalRingLarge} />
        <View style={styles.orbitalRingMedium} />
        <View style={styles.orbitalRingSmall} />
      </View>
      <View style={styles.floatingSquare} />
      <View style={styles.floatingCircle} />
      <View style={styles.floatingBorder} />
    </>
  );
}

const styles = StyleSheet.create({
  ringsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitalRingLarge: {
    width: width * 1.2,
    height: width * 1.2,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.1)',
    borderRadius: (width * 1.2) / 2,
  },
  orbitalRingMedium: {
    position: 'absolute',
    width: width,
    height: width,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.15)',
    borderRadius: width / 2,
  },
  orbitalRingSmall: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.2)',
    borderRadius: (width * 0.8) / 2,
  },
  floatingSquare: {
    position: 'absolute',
    top: 80,
    left: 40,
    width: 20,
    height: 20,
    backgroundColor: 'rgba(66, 153, 225, 0.1)',
    borderRadius: 3,
    transform: [{ rotate: '45deg' }],
  },
  floatingCircle: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(66, 153, 225, 0.2)',
  },
  floatingBorder: {
    position: 'absolute',
    top: height * 0.5,
    left: 5,
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.3)',
    borderRadius: 6,
  },
});

export default Ornaments;
