import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Header from '../components/Header';
import MapBackground from '../components/MapBackground';
import AddEvacLocOnMap from '../components/AddEvacLocOnMap';

const AddEvacuationSiteScreen = ({ navigation }) => {
  return (
    <View className="flex-1">
      <Header 
        title="Add Evacuation Site" 
        onBack={() => navigation.navigate('EvacuationSitesScreen')} 
      />

      <AddEvacLocOnMap instruction="Tap on the map to select location" />

      
    </View>
  );
};

export default AddEvacuationSiteScreen;