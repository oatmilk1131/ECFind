import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useAuth } from '../context/Auth';
import StyleButton from '../components/StyleButton';
import StyleTextInput from '../components/StyleTextInput';
import AppBackground from '../components/AppBackground';


const logo = require('../assets/images/logo.png');

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (isSubmitting) {
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await signUp({ name, username, contactNumber, password });
    } catch (err) {
      setError(err.message ?? 'Unable to create an account right now.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <AppBackground>
      <View className="flex-1">
        <View className=" justify-center items-center">
            <Image source={logo} className="w-full h-96 resize-contain" />
        </View>

        <View className=" justify-center pl-10 pr-10 ">
          <Text className="text-3xl font-bold text-center mb-7 mt-0 text-gray-800">Sign Up</Text>
            <Text className="pl-3 pb-1 font-bold">Name</Text>
            <StyleTextInput
              placeholder="e.g. Antwone Buban"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isSubmitting}
            />
            <Text className="pl-3 pb-1 font-bold">Username</Text>
            <StyleTextInput
              placeholder="Antwone"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isSubmitting}
            />
            <Text className="pl-3 pb-1 font-bold">Contact Number</Text>
            <StyleTextInput
              placeholder="e.g. 0912 9302 0321"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
              editable={!isSubmitting}
            />
            <Text className="pl-3 pb-1 font-bold">Password</Text>
            <StyleTextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isSubmitting}
            />
            {error ? (
              <Text className="text-red-500 text-sm text-center mb-2">{error}</Text>
            ) : null}
            <StyleButton
              title={isSubmitting ? 'Creating account...' : 'Sign Up'}
              onPress={handleSignUp}
              className='mt-[40] py-3 px-5 rounded-full w-full items-center mb-3'
            />
        </View>
      </View>
    </AppBackground>
  );
};