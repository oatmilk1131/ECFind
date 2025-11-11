import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export default function BottomSheet({
  minHeight = Math.round(WINDOW_HEIGHT * 0.3),
  maxHeight = Math.round(WINDOW_HEIGHT * 0.8),
  isExpanded,
  onExpand = () => {},
  onCollapse = () => {},
  title = 'Site details',
  children,
}) {
  // translateY controls the sheet position.
  // 0 = fully expanded, collapsedOffset = maxHeight - minHeight, hiddenOffset = WINDOW_HEIGHT
  const collapsedOffset = maxHeight - minHeight;
  const hiddenOffset = WINDOW_HEIGHT;
  const translateY = useRef(new Animated.Value(hiddenOffset)).current;
  const currentTranslate = useRef(hiddenOffset);
  const mounted = useRef(false);
  const panStart = useRef(0);

  // Add new state to track if sheet should be visible
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const id = translateY.addListener(({ value }) => {
      currentTranslate.current = value;
    });

    // initialize hidden then bring into collapsed (visible) or expanded depending on isExpanded
    translateY.setValue(hiddenOffset);
    // animate into view on mount:
    if (isExpanded) {
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => onExpand());
    } else {
      Animated.timing(translateY, { toValue: collapsedOffset, duration: 220, useNativeDriver: true }).start();
    }

    mounted.current = true;
    return () => translateY.removeListener(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only on mount

  // respond to isExpanded changes after mount
  useEffect(() => {
    if (!mounted.current) return;

    if (!isVisible) {
      // Slide down to hide
      Animated.timing(translateY, {
        toValue: hiddenOffset,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        onCollapse();
      });
    } else if (isExpanded) {
      // Expand fully
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(onExpand);
    } else {
      // Collapse to minHeight
      Animated.timing(translateY, {
        toValue: collapsedOffset,
        duration: 200,
        useNativeDriver: true,
      }).start(onCollapse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, isVisible]);

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        panStart.current = currentTranslate.current;
      },
      onPanResponderMove: (_, gs) => {
        // gs.dy positive => dragging down (increase translateY)
        const newVal = clamp(panStart.current + gs.dy, 0, hiddenOffset);
        translateY.setValue(newVal);
      },
      onPanResponderRelease: (_, gs) => {
        const final = currentTranslate.current;
        const midpoint = collapsedOffset / 2;
        const velocity = gs.vy;

        if (velocity < -0.6 || final < midpoint) {
          // expand
          Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }).start(onExpand);
        } else if (velocity > 0.8 || final > collapsedOffset + 40) {
          // hide completely off-screen
          Animated.timing(translateY, { toValue: hiddenOffset, duration: 180, useNativeDriver: true }).start(onCollapse);
        } else {
          // settle to collapsed visible state
          Animated.timing(translateY, { toValue: collapsedOffset, duration: 160, useNativeDriver: true }).start(onCollapse);
        }
      },
    })
  ).current;

  // Add visibility check to render
  if (!isVisible) return null;

  // render
  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: maxHeight,
          transform: [{ translateY }],
        },
      ]}
    >
      <View {...panResponder.panHandlers} style={styles.handleContainer}>
        <View style={styles.handle} />
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity
            onPress={() => {
              // hide off-screen when close pressed
              Animated.timing(translateY, { toValue: hiddenOffset, duration: 180, useNativeDriver: true }).start(onCollapse);
            }}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.content, { height: maxHeight - 56 }]}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  handleContainer: {
    paddingTop: 8,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  handle: {
    width: 60,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeText: {
    color: '#007AFF',
    fontSize: 14,
  },
  content: {
    padding: 12,
  },
});
