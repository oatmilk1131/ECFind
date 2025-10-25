import React, { useRef } from 'react';
import { View, Animated, PanResponder } from 'react-native';

const BottomSheet = ({ 
  height, 
  isExpanded, 
  onExpand, 
  onCollapse, 
  minHeight, 
  maxHeight, 
  children 
}) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy < 0) {
          const newHeight = Math.max(minHeight, minHeight - gestureState.dy);
          height.setValue(newHeight);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy < -50) {
          onExpand();
        } else {
          onCollapse();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        { height },
        {
          backgroundColor: 'white',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
          elevation: 8,
          overflow: 'hidden',
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={{ alignItems: 'center', paddingVertical: 8 }}>
        <View style={{ width: 48, height: 6, borderRadius: 3, backgroundColor: '#e2e8f0' }} />
      </View>
      <View style={{ padding: 12 }}>{children}</View>
    </Animated.View>
  );
};

export default BottomSheet;