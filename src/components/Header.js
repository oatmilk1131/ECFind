import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

const Header = ({ title, onBack, showBackButton = true }) => (
  <View style={styles.headerContainer}>
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  </View>
);

export default Header;