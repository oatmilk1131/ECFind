import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';

const MapBackground = ({ children, instruction }) => (
  <ImageBackground
    source={{
      uri: 'https://images.unsplash.com/photo-1540959733332-abcbf6cb1453?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    }}
    style={{ width: '100%', height: 300, justifyContent: 'center' }}
    resizeMode="cover"
  >
    <View style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: 12, alignSelf: 'flex-start', margin: 12, borderRadius: 6 }}>
      <Text style={{ color: 'white', fontWeight: '700' }}>{instruction || 'MAP HERE'}</Text>
    </View>
    {children}
  </ImageBackground>
);

export default MapBackground;