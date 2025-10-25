import React from 'react';
import { TextInput } from 'react-native';

export default function StyleTextInput({ style, ...props }) {
    
  const inputClasses = "bg-white h-14 border-2 border-black-50 rounded-full mb-4 px-4 text-base ";

  return (
    <TextInput
      className={inputClasses}
      placeholderTextColor="#A0A0A0" 
      {...props} 
    />
  );
}