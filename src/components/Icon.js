import React from 'react';
import { Text } from 'react-native';

const Icon = ({ name, size = 24, color = 'black' }) => {
  const iconMap = {
    'checkmark-circle': '✓',
    'location': '📍',
    'trash': '🗑️',
    'close-circle': '✗',
    'search': '🔍',
    'person-circle-outline': '👤',
    'eye': '👁️',
    'code-slash': '💻',
    'person': '🧑',
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '○'}
    </Text>
  );
};

export default Icon;