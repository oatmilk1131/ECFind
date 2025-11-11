import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from '../components/Icon';
import styles from '../styles/styles';
import StyleButton from '../components/StyleButton';
import { useAuth } from '../context/Auth';
import {
  loadSiteManagerRequests,
  updateSiteManagerRequestStatus,
} from '../utils/dataService';

const statusColors = {
  pending: '#f59e0b',
  approved: '#16a34a',
  declined: '#dc2626',
};

export default function RegistrationRequests({ navigation }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const data = loadSiteManagerRequests();
      setRequests(data.requests);
    }, [])
  );

  const handleStatusChange = (request, status) => {
    Alert.alert(
      `${status === 'approved' ? 'Approve' : 'Decline'} Request`,
      `Are you sure you want to mark ${request.fullName}'s request as ${status}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            try {
              const updated = updateSiteManagerRequestStatus(request.id, status);
              setRequests((prev) =>
                prev.map((req) => (req.id === request.id ? updated : req))
              );
              Alert.alert('Updated', `Request ${status}.`);
            } catch (error) {
              Alert.alert('Unable to update', error.message ?? 'Try again later.');
            }
          },
        },
      ]
    );
  };

  if (!['admin', 'developer'].includes(user?.role)) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Text className="text-lg font-semibold mb-4 text-center">
          Only administrators can view registration requests.
        </Text>
        <StyleButton title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View className="flex-row justify-between items-center px-4 mt-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-blue-600 font-semibold">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
          <Text className="text-blue-600 font-semibold">Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.lowerHeader}>
        <Text style={styles.title}>REGISTRATION REQUESTS</Text>
        <View style={styles.line} />
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View className="flex-1 pr-2">
              <Text style={styles.listText}>{item.fullName}</Text>
              <Text className="text-xs text-gray-500">{item.contactNumber}</Text>
              <Text className="text-xs text-gray-400">{item.reason}</Text>
            </View>
            <View className="items-center mr-3">
              <Text
                className="text-xs font-semibold"
                style={{ color: statusColors[item.status] ?? '#0f172a' }}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => handleStatusChange(item, 'approved')}
                disabled={item.status === 'approved'}
              >
                <Icon
                  name="checkmark-circle"
                  size={24}
                  color={item.status === 'approved' ? '#9ca3af' : 'green'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleStatusChange(item, 'declined')}
                disabled={item.status === 'declined'}
              >
                <Icon
                  name="close-circle"
                  size={24}
                  color={item.status === 'declined' ? '#9ca3af' : 'red'}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No pending requests.
          </Text>
        }
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Return to menu</Text>
      </TouchableOpacity>
    </View>
  );
}
