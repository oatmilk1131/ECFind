import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Animated, StatusBar, Dimensions } from 'react-native';
import MapBackground from '../components/MapBackground';
import BottomSheet from '../components/BottomSheet';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const BOTTOM_SHEET_MAX_HEIGHT = Math.round(Dimensions.get('window').height * 0.8);
const BOTTOM_SHEET_MIN_HEIGHT = Math.round(Dimensions.get('window').height * 0.3);

const HomeScreen = ({ navigation }) => {
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
      
      <MapBackground
        onMarkerPress={handleMarkerPress}
      >
        
      </MapBackground>
      
      {/* only render BottomSheet when a marker is selected */}
      {selectedMarker && (
      <BottomSheet
        height={bottomSheetHeight} // Pass the Animated.Value
        minHeight={BOTTOM_SHEET_MIN_HEIGHT}
        maxHeight={BOTTOM_SHEET_MAX_HEIGHT}
        isExpanded={isExpanded}
        onExpand={handleExpand}
        onCollapse={handleCollapse}
      >
        {/* details */}
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