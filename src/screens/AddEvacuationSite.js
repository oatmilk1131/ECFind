import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from '../components/Icon';
import styles from '../styles/styles';

export default function AddEvacuationSite({ setCurrentScreen }) {
  const [site, setSite] = useState('');
  const [added, setAdded] = useState(false);

  const handleAddSite = () => {
    if (!site.trim()) {
      Alert.alert('Error', 'Please enter a location for the evacuation site');
      return;
    }
    setAdded(true);
  };

  const handleReset = () => {
    setSite('');
    setAdded(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.lowerHeader}>
        <Text style={styles.title}>ADD EVACUATION SITE</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.centerContent}>
        {!added ? (
          <>
            <TextInput
              placeholder="Input the location of the evacuation site"
              style={styles.input}
              value={site}
              onChangeText={setSite}
            />
            <TouchableOpacity
              style={[styles.addButton, !site.trim() && styles.disabledButton]}
              onPress={handleAddSite}
              disabled={!site.trim()}
            >
              <Icon name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.buttonText}>Add Site</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successBox}>
            <Text style={styles.successText}>Evacuation site located @{site}</Text>
            <Text style={styles.successText}>Has been successfully added</Text>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetText}>Add Another Site</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('DeveloperMenu')}>
          <Text style={styles.backText}>Return to menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}