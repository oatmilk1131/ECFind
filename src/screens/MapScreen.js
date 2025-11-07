import React, { useState, useRef } from 'react';
import { View, StatusBar, Dimensions, Animated } from 'react-native';
import MapBackground from '../components/MapBackground';
import BottomSheet from '../components/BottomSheet';
import Header from '../components/Header';

const BOTTOM_SHEET_MAX_HEIGHT = Dimensions.get('window').height * 0.8;
const BOTTOM_SHEET_MIN_HEIGHT = 180;

const MapScreen = ({ navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      <Header 
        title="Map View" 
        onBack={() => navigation.navigate('Home')} 
      />

      <MapBackground />

      <BottomSheet
        height={bottomSheetHeight}
        isExpanded={isExpanded}
        onExpand={expandBottomSheet}
        onCollapse={collapseBottomSheet}
        minHeight={BOTTOM_SHEET_MIN_HEIGHT}
        maxHeight={BOTTOM_SHEET_MAX_HEIGHT}
      >
      
      </BottomSheet>
    </View>
  );
};

export default MapScreen;