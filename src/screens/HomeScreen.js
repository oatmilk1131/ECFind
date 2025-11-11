import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Animated, StatusBar, Dimensions } from 'react-native';
import MapBackground from '../components/MapBackground';
import BottomSheet from '../components/BottomSheet';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useAuth } from '../context/Auth';

const BOTTOM_SHEET_MAX_HEIGHT = Math.round(Dimensions.get('window').height * 0.8);
const BOTTOM_SHEET_MIN_HEIGHT = Math.round(Dimensions.get('window').height * 0.3);

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const bottomSheetHeight = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;

  const handleMarkerPress = (marker) => {
    if (marker) {
      setSelectedMarker(marker);
      // ensure sheet starts collapsed
      bottomSheetHeight.setValue(BOTTOM_SHEET_MIN_HEIGHT);
      setIsExpanded(false);
    } else {
      // request collapse; BottomSheet will animate and we unmount after a short delay
      setIsExpanded(false);
      const COLLAPSE_DURATION = 320;
      setTimeout(() => setSelectedMarker(null), COLLAPSE_DURATION);
    }
  };

  // no animation here — only toggle boolean
  const handleCollapse = () => {
    setIsExpanded(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" >
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View className="flex-row justify-between items-center px-4 py-2">
        {['manager', 'admin', 'developer'].includes(user?.role) && (
          <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full" onPress={() => navigation.navigate('Map')}>
            <Text className="text-white font-semibold">Manage Sites</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity className="bg-yellow-400 px-4 py-2 rounded-full" onPress={() => navigation.navigate('UserProfile')}>
          <Text className="font-semibold">User Profile</Text>
        </TouchableOpacity>
      </View>
      
      <MapBackground
        onMarkerPress={handleMarkerPress}
      />
      
    
      {selectedMarker && (
      <BottomSheet
        height={bottomSheetHeight}
        minHeight={BOTTOM_SHEET_MIN_HEIGHT}
        maxHeight={BOTTOM_SHEET_MAX_HEIGHT}
        isExpanded={isExpanded}
        onExpand={handleExpand}
        onCollapse={handleCollapse}
      >
       
      </BottomSheet>
      )}

      <DeleteConfirmationModal
        visible={showDeleteConfirmation}
        siteToDelete={siteToDelete}
        onConfirm={() => {
          console.log(`Deleting site: ${siteToDelete}`);
          setShowDeleteConfirmation(false);
          setSiteToDelete(null);
        }}
        onCancel={() => {
          setShowDeleteConfirmation(false);
          setSiteToDelete(null);
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
