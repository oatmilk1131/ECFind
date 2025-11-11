import React from 'react';
import { View } from 'react-native';
import Header from '../components/Header';
import AddEvacLocOnMap from '../components/AddEvacLocOnMap';
import { useAuth } from '../context/Auth';
import StyleButton from '../components/StyleButton';
import { useRoute } from '@react-navigation/native';

const AddEvacuationSiteScreen = ({ navigation }) => {
  const route = useRoute();
  const params = route?.params ?? {};
  const returnTo = params.returnTo;
  const initialCoordinate = params.initialCoordinate;
  const siteId = params.siteId;
  const { user } = useAuth();
  const canManage = ['manager', 'admin'].includes(user?.role);

  if (!canManage) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-white">
        <Text className="text-lg font-semibold text-center mb-4">
          Only site managers can add evacuation sites.
        </Text>
        <StyleButton title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Header 
        title="Add Evacuation Site" 
        onBack={() => navigation.navigate('EvacuationSites')} 
      />

      <AddEvacLocOnMap
        instruction="Tap on the map to select location"
        initialCoordinate={initialCoordinate}
        onLocationSelected={(coordinate) => {
          if (returnTo) {
            navigation.navigate({
              name: returnTo,
              params: {
                coordinate,
                siteId,
                timestamp: Date.now(),
              },
              merge: true,
            });
            navigation.goBack();
          } else {
            navigation.navigate('EvacSiteDetails', { coordinate });
          }
        }}
      />

      <View className="flex-row justify-around items-center px-4 py-3 bg-white border-t border-gray-200">
        <StyleButton
          title="Map View"
          className="flex-1 mr-2"
          onPress={() => navigation.navigate('Map')}
        />
        <StyleButton
          title="User Profile"
          className="flex-1 ml-2 bg-yellow-400"
          onPress={() => navigation.navigate('UserProfile')}
        />
      </View>
    </View>
  );
};

export default AddEvacuationSiteScreen;
