import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Animated, StatusBar, Dimensions } from 'react-native';
import MapBackground from '../components/MapBackground';
import BottomSheet from '../components/BottomSheet';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const BOTTOM_SHEET_MAX_HEIGHT = Dimensions.get('window').height * 0.8;
const BOTTOM_SHEET_MIN_HEIGHT = 180;

const HomeScreen = ({ navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState(null);
  
  const bottomSheetHeight = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;

  const expandBottomSheet = () => {
    setIsExpanded(true);
    Animated.spring(bottomSheetHeight, {
      toValue: BOTTOM_SHEET_MAX_HEIGHT,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  };

  const collapseBottomSheet = () => {
    setIsExpanded(false);
    Animated.spring(bottomSheetHeight, {
      toValue: BOTTOM_SHEET_MIN_HEIGHT,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity 
          className="p-2 bg-yellow-300 rounded-full"
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Text className="text-xl">👤</Text>
        </TouchableOpacity>
        <View className="flex-1" />
      </View>

      <MapBackground />

      <BottomSheet
        height={bottomSheetHeight}
        isExpanded={isExpanded}
        onExpand={expandBottomSheet}
        onCollapse={collapseBottomSheet}
        minHeight={BOTTOM_SHEET_MIN_HEIGHT}
        maxHeight={BOTTOM_SHEET_MAX_HEIGHT}
      >
        {/* Default View (When not dragged up) */}
        <View style={{ display: isExpanded ? 'none' : 'flex' }} className="p-4">
          {/* Bottom Sheet Default Content */}
        </View>

        {/* Expanded View */}
        <View style={{ display: isExpanded ? 'flex' : 'none' }} className="p-4">
          {/* Bottom Sheet Expanded Content */}
        </View>
      </BottomSheet>

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