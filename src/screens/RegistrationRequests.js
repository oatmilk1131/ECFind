import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from '../components/Icon';
import styles from '../styles/styles';
import { useDatabase } from '../context/DatabaseContext';

export default function RegistrationRequests({ navigation }) {
  const { pendingRegistrations, removePendingRegistration } = useDatabase();

  const requests = useMemo(() => pendingRegistrations ?? [], [pendingRegistrations]);

  const handleApprove = (request) => {
    Alert.alert(
      'Approve Registration',
      `Approve registration for ${request.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            removePendingRegistration(request.id);
            Alert.alert('Success', `${request.name} has been approved.`);
          },
        },
      ]
    );
  };

  const handleReject = (request) => {
    Alert.alert(
      'Reject Registration',
      `Reject registration for ${request.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            removePendingRegistration(request.id);
            Alert.alert('Success', `${request.name} has been removed.`);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.lowerHeader}>
        <Text style={styles.title}>REGISTRATION REQUESTS</Text>
        <View style={styles.line} />
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listText}>{item.name}</Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>{item.contactNumber}</Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>Role: {item.requestedRole}</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleApprove(item)}>
                <Icon name="checkmark-circle" size={24} color="green" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleReject(item)}>
                <Icon name="close-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#6b7280' }}>No pending registration requests.</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('DeveloperMenu')}>
        <Text style={styles.backText}>Return to menu</Text>
      </TouchableOpacity>
    </View>
  );
}
