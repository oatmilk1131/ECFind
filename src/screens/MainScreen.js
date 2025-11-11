import React from 'react';
import { View, Image } from 'react-native'; 
import StyleButton from '../components/StyleButton';
import AppBackground from '../components/AppBackground';

const logo = require('../assets/images/logo.png');
export default function MainScreen({ navigation }) {
  return (
    <AppBackground>
      <View className="flex-1 pt-8 pr-10 pl-10">
        <View className="justify-center items-center pt-[10] pb-[250]">
          <Image source={logo} className="w-full h-96 resize-contain" />
        </View>

        <View className="justify-center items-center">
          <StyleButton 
            onPress={() => navigation.navigate('Login')} 
            title="Login" 
            className='py-3 px-5 rounded-full w-full items-center mb-3'
          />
          <StyleButton
            onPress={() => navigation.navigate('SignUp')} 
            title="Sign Up" 
            variant='secondaryClasses'
            className='py-3 px-5 rounded-full w-full items-center mb-3'
          />
        </View>
      </View>
    </AppBackground>
  );
}
