import React from 'react';
import { View, Text, Image } from 'react-native';
import { useAuth } from '../context/Auth';
import StyleButton from '../components/StyleButton';
import StyleTextInput from '../components/StyleTextInput';
import AppBackground from '../components/AppBackground';


export default function LoginScreen({ navigation }) {
  const { logIn } = useAuth();
  const logo = require('../assets/images/logo.png');
  return (
    <AppBackground>
      <View>
        <View className=" justify-center items-center">
            <Image source={logo} className="w-full h-96 resize-contain" />
        </View>
      
      <View className=" justify-center pl-10 pr-10 ">
          <Text className="text-3xl font-bold text-center mb-7 mt-0 text-gray-800">Login</Text>
           
            <Text className="pl-3 pb-1 font-bold">Username</Text>
            <StyleTextInput placeholder="e.g. Antwone"  />
            <Text className="pl-3 pb-1 font-bold">Password</Text>
            <StyleTextInput placeholder="Password" secureTextEntry/>
            <StyleButton title="Login" onPress={logIn} className='mt-[120] py-3 px-5 rounded-full w-full items-center mb-3'/>
            <StyleButton title="Create an Account" variant="secondary" className='py-3 px-5 rounded-full w-full items-center mb-3' onPress={() => navigation.navigate('SignUp')} />
        </View>
      </View>
    </AppBackground>
  );
}