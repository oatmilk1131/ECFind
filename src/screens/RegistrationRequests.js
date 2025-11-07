import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from '../components/Icon';
import styles from '../styles/styles';

export default function RegistrationRequests({ setCurrentScreen }) {
  const initialUsers = [
    'John Doe - 09956982021',
    'Jane Smith - 09556323456',
    'Mike Johnson - 09451235752',
    'Sarah Wilson - 09564123789',
    'Tom Brown - 091542032',
    'Emily Davis - 09452163652',
    'Robert Wilson - 09746985210',
    'Lisa Anderson - 09432612056'
  ];
  const [users, setUsers] = useState(initialUsers);

  const handleApprove = (user) => {
    Alert.alert(
      'Approve Registration',
      `Approve registration for ${user}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            setUsers(users.filter(u => u !== user));
            Alert.alert('Success', 'Registration approved successfully');
          }
        }
      ]
    );
  };

  const handleReject = (user) => {
    Alert.alert(
      'Reject Registration',
      `Reject registration for ${user}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter(u => u !== user));
            Alert.alert('Success', 'Registration rejected successfully');
          }
        }
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
        data={users}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item}</Text>
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
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('DeveloperMenu')}>
        <Text style={styles.backText}>Return to menu</Text>
      </TouchableOpacity>
    </View>
  );
}