import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import StyleButton from '../components/StyleButton';
import StyleTextInput from '../components/StyleTextInput';
import AppBackground from '../components/AppBackground';
import { useAuth } from '../context/Auth';
import { createSiteManagerRequest, loadSiteManagerRequests } from '../utils/dataService';


const logo = require('../assets/images/logo.png');

export default function ApplyManagerScreen({ navigation }) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [contactNumber, setContactNumber] = useState(user?.phone ?? '');
  const [reason, setReason] = useState('');
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const data = loadSiteManagerRequests();
    const existing = data.requests.find((req) => req.userId === user?.id);
    if (existing) setRequest(existing);
  }, [user]);

  const handleApply = () => {
    if (!user) {
      Alert.alert('Please sign in', 'You need an account to apply as a site manager.', [
        { text: 'Go to Login', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }

    if (['manager', 'admin'].includes(user.role)) {
      Alert.alert('Already Authorized', 'You already have permissions to manage evacuation sites.');
      return;
    }

    if (!fullName || !contactNumber || !reason) {
      Alert.alert('Missing details', 'Please fill out all fields before submitting your request.');
      return;
    }

    try {
      const newRequest = createSiteManagerRequest({
        userId: user.id,
        username: user.username,
        fullName,
        contactNumber,
        reason,
      });
      setRequest(newRequest);
      Alert.alert(
        'Application Sent',
        'Your site manager application has been submitted. You will be notified once it is reviewed.'
      );
    } catch (error) {
      Alert.alert('Unable to submit', error.message ?? 'Please try again later.');
    }
  };

  const statusLabel = request
    ? request.status === 'pending'
      ? 'Your application is pending review.'
      : request.status === 'approved'
      ? 'Your application has been approved.'
      : 'Your application was declined.'
    : 'Submit your details to become a site manager.';

  return (
    <AppBackground>
      <View className="flex-1">
        <View className=" justify-center items-center">
            <Image source={logo} className="w-full h-96 resize-contain" />
        </View>

        <View className=" justify-center pl-10 pr-10 ">
          <Text className="text-3xl font-bold text-center mb-7 mt-0 text-gray-800">Site Manager Application</Text>
            <Text className="text-sm text-gray-500 mb-4 text-center">{statusLabel}</Text>

            <Text className="pl-3 pb-1 font-bold">Full Name</Text>
            <StyleTextInput
              placeholder="e.g. Antwone Buban"
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
            />
            <Text className="pl-3 pb-1 font-bold">Contact Number</Text>
            <StyleTextInput
              placeholder="e.g. 0912 9302 0321"
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={setContactNumber}
            />
            <Text className="pl-3 pb-1 font-bold">Why should we approve you?</Text>
            <StyleTextInput
              placeholder="Share your experience or motivation"
              value={reason}
              onChangeText={setReason}
              multiline
            />
            <StyleButton
              title={request?.status === 'pending' ? 'Application Pending' : 'Submit Application'}
              onPress={handleApply}
              className="py-3 px-5 rounded-full w-full items-center mb-3"
              disabled={request?.status === 'pending'}
            />
        </View>
      </View>
    </AppBackground>
  );
}
