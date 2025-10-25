import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';

const background = require('../assets/images/background.png');

export default function AppBackground({ children, style }) {
  return (
    <ImageBackground source={background} style={[styles.bg, style]} imageStyle={styles.image}>
      <View style={styles.inner}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  image: { resizeMode: 'cover' },
  inner: { flex: 1 },
});
