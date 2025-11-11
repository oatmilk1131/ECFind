import React, { useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { useAuth } from '../context/Auth';
import StyleButton from '../components/StyleButton';
import StyleTextInput from '../components/StyleTextInput';
import AppBackground from '../components/AppBackground';
import { authenticateUser } from '../utils/dataService';

export default function LoginScreen({ navigation }) {
  const { logIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const logo = require('../assets/images/logo.png');

  const handleLogin = () => {
    const foundUser = authenticateUser(username, password);
    if (foundUser) {
      logIn(foundUser);
      Alert.alert('Success', `Welcome ${foundUser.username}!`);
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  };

  return (
    <AppBackground>
      <View>
        <View className=" justify-center items-center">
          <Image source={logo} className="w-full h-96 resize-contain" />
        </View>

        <View className=" justify-center pl-10 pr-10 ">
          <Text className="text-3xl font-bold text-center mb-7 mt-0 text-gray-800">Login</Text>

          <Text className="pl-3 pb-1 font-bold">Username</Text>
          <StyleTextInput placeholder="e.g. Antwone" value={username} onChangeText={setUsername} />
          <Text className="pl-3 pb-1 font-bold">Password</Text>
          <StyleTextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <StyleButton title="Login" onPress={handleLogin} className='mt-[120] py-3 px-5 rounded-full w-full items-center mb-3' />
          <StyleButton title="Create an Account" variant="secondary" className='py-3 px-5 rounded-full w-full items-center mb-3' onPress={() => navigation.navigate('SignUp')} />
        </View>
      </View>
    </AppBackground>
  );
}