import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function StyleButton({ title, onPress, variant = 'primary', className = ""}) {
  // Normalize variant to handle accidental strings like 'secondaryClasses'
  const v = String(variant || '').toLowerCase();

  // If caller already provided a Tailwind background class (bg-...), don't override it.
  const hasBgInClass = /\bbg-[\w-]+\b/.test(className);

  // Default contrasting background classes when caller didn't provide one
  let colorClass = '';
  if (!hasBgInClass) {
    if (v.includes('secondary')) colorClass = 'bg-gray-700';
    else if (v.includes('danger') || v.includes('delete')) colorClass = 'bg-red-500';
    else colorClass = 'bg-blue-500';
  }

  const baseClasses = "rounded-full items-center justify-center mb-3";
  const buttonClasses = `${baseClasses} ${colorClass} ${className}`.trim();

  // Keep the existing subtle 3D border treatment but derive based on normalized variant
  const conditionalStyle =
    v.includes('secondary') ? {
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderColor: '#6c8dc7ff',
    } : v.includes('danger') ? {
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderColor: '#cc2b2b',
    } : {
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderColor: '#ff9500',
    };

  // Decide text color: if the final classes include a light bg, use dark text, else white
  const lightBg = /\bbg-(white|gray-100|gray-50|gray-200)\b/.test(buttonClasses);
  const textClass = lightBg ? 'text-black' : 'text-white';

  return (
    <TouchableOpacity
      className={buttonClasses}
      onPress={onPress}
      style={conditionalStyle}
    >
      <Text className={`${textClass} text-lg font-bold`}>{title}</Text>
    </TouchableOpacity>
  );
}