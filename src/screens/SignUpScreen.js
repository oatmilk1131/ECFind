import React from 'react';
import { View, Text, Image } from 'react-native';
import { useAuth } from '../context/Auth';
import StyleButton from '../components/StyleButton';
import StyleTextInput from '../components/StyleTextInput';
import AppBackground from '../components/AppBackground';


const logo = require('../assets/images/logo.png');

export default function SignUpScreen() {
  const { signUp } = useAuth();
  return (
    <AppBackground>
      <View className="flex-1">
        <View className=" justify-center items-center">
            <Image source={logo} className="w-full h-96 resize-contain" />
        </View>

        <View className=" justify-center pl-10 pr-10 ">
          <Text className="text-3xl font-bold text-center mb-7 mt-0 text-gray-800">Sign Up</Text>
            <Text className="pl-3 pb-1 font-bold">Name</Text>
            <StyleTextInput placeholder="e.g. Antwone Buban" autoCapitalize="none" />
            <Text className="pl-3 pb-1 font-bold">Username</Text>
            <StyleTextInput placeholder="Antwone"  />
            <Text className="pl-3 pb-1 font-bold">Contact Number</Text>
            <StyleTextInput placeholder="e.g. 0912 9302 0321" />
            <Text className="pl-3 pb-1 font-bold">Password</Text>
            <StyleTextInput placeholder="Password" secureTextEntry/>
            <StyleButton title="Sign Up" onPress={signUp} className='mt-[40] py-3 px-5 rounded-full w-full items-center mb-3'/>
        </View>
      </View>
    </AppBackground>
  );
};