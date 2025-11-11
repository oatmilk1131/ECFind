import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';

const BackArrow = ({ onPress, fallback, className = '', iconColor = 'black' }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (typeof onPress === 'function') {
      onPress();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    if (fallback) {
      navigation.navigate(fallback);
    }
  };

  return (
    <TouchableOpacity
      className={`bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ${className}`.trim()}
      onPress={handlePress}
    >
      <ArrowLeftIcon size={20} color={iconColor} />
    </TouchableOpacity>
  );
};

export default BackArrow;
