import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Header from '../components/Header';
import MapBackground from '../components/MapBackground';

const AddEvacuationSiteScreen = ({ navigation }) => {
  return (
    <View className="flex-1">
      <Header 
        title="Add Evacuation Site" 
        onBack={() => navigation.navigate('EvacuationSitesScreen')} 
      />

      <MapBackground instruction="Tap on the map to select location" />

      <View className="absolute bottom-0 left-0 right-0 flex-row justify-between p-4">
        <TouchableOpacity 
          className="flex-1 mr-2 bg-gray-200 rounded-lg py-3 items-center"
          onPress={() => navigation.navigate('EvacuationSitesScreen')}
        >
          <Text className="text-gray-800 font-semibold">CANCEL</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 ml-2 bg-blue-500 rounded-lg py-3 items-center"
          onPress={() => navigation.navigate('EvacSiteDetails')}
        >
          <Text className="text-white font-semibold">OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddEvacuationSiteScreen;