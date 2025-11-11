import React, { useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { useAuth } from '../context/Auth';
import StyleButton from '../components/StyleButton';
import StyleTextInput from '../components/StyleTextInput';
import AppBackground from '../components/AppBackground';
import BackArrow from '../components/BackArrow';


const logo = require('../assets/images/logo.png');

export default function SignUpScreen({ navigation }) {
  const { logIn, registerUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (!fullName || !username || !password) {
      Alert.alert('Missing Info', 'Name, username, and password are required.');
      return;
    }
    try {
      const { profile } = registerUser({
        fullName,
        username,
        contactNumber,
        password,
      });
      Alert.alert('Account created', 'You can now log in with your credentials.', [
        {
          text: 'OK',
          onPress: () => {
            logIn({
              id: profile.id,
              username: profile.username,
              fullName: profile.fullName,
              email: profile.email,
              role: profile.role,
            });
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Unable to sign up', error.message ?? 'Please try again later.');
    }
  };

  return (
    <AppBackground>
      <View className="flex-1">
        <View className="px-4 pt-6">
          <BackArrow fallback="Main" />
        </View>
        <View className=" justify-center items-center">
            <Image source={logo} className="w-full h-96 resize-contain" />
        </View>

        <View className=" justify-center pl-10 pr-10 ">
          <Text className="text-3xl font-bold text-center mb-7 mt-0 text-gray-800">Sign Up</Text>
            <Text className="pl-3 pb-1 font-bold">Name</Text>
            <StyleTextInput placeholder="e.g. Antwone Buban" autoCapitalize="words" value={fullName} onChangeText={setFullName} />
            <Text className="pl-3 pb-1 font-bold">Username</Text>
            <StyleTextInput placeholder="Antwone" value={username} onChangeText={setUsername} autoCapitalize="none" />
            <Text className="pl-3 pb-1 font-bold">Contact Number</Text>
            <StyleTextInput placeholder="e.g. 0912 9302 0321" value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" />
            <Text className="pl-3 pb-1 font-bold">Password</Text>
            <StyleTextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <StyleButton title="Sign Up" onPress={handleSignUp} className='mt-[40] py-3 px-5 rounded-full w-full items-center mb-3'/>
        </View>
      </View>
    </AppBackground>
  );
};
