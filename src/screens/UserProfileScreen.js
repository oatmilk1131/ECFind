import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { useAuth } from '../context/Auth';
import StyleButton from '../components/StyleButton';
import AppBackground from '../components/AppBackground';
import {ArrowLeftIcon, PencilSquareIcon} from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyleTextInput from '../components/StyleTextInput';
import ProfileEditCard from '../components/ProfileEdit';
import { loadUsers, loadSiteManagerRequests } from '../utils/dataService';
import styles from '../styles/styles';
import { useFocusEffect } from '@react-navigation/native';


export default function UserProfileScreen({navigation}) {

  const { logOut, user } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [requestStatus, setRequestStatus] = useState(null);

  useEffect(() => {
    const data = loadUsers();
    setAllUsers(data.users);
  }, []);

  const refreshRequestStatus = useCallback(() => {
    if (!user?.id) {
      setRequestStatus(null);
      return;
    }
    const requests = loadSiteManagerRequests().requests;
    setRequestStatus(requests.find((req) => req.userId === user.id) ?? null);
  }, [user?.id]);

  useFocusEffect(refreshRequestStatus);
  useEffect(() => {
    refreshRequestStatus();
  }, [refreshRequestStatus]);

  const [userData, setUserData] = useState({
    name: user?.username ?? 'User',
    contact: user?.phone ?? '',
    password: '********',
  });

  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      name: user?.username ?? prev.name,
      contact: user?.phone ?? prev.contact,
    }));
  }, [user?.username, user?.phone]);

  
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const handleEditStart = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSave = (field) => {
    
    setUserData(prev=> ({
      ...prev,
      [field]: tempValue
    }));
  

  setEditingField(null);
  setTempValue('');

  alert(`${field} updated successfully to: ${tempValue}`);

};

  const role = user?.role ?? 'user';

  const renderRoleActions = () => {
    if (!user) return null;

    if (role === 'admin' || role === 'developer') {
      return (
        <>
          {role === 'developer' && (
            <StyleButton
              title="Developer Menu"
              onPress={() => navigation.navigate('Developer')}
            />
          )}
          <StyleButton
            title="Registration Requests"
            onPress={() => navigation.navigate('RegistrationRequests')}
          />
          <StyleButton
            title="Delete Evacuation Sites"
            onPress={() => navigation.navigate('DeleteEvacuationSites')}
          />
          <StyleButton
            title="View Evacuation Sites"
            onPress={() => navigation.navigate('EvacuationSites')}
          />
        </>
      );
    }

    if (role === 'manager') {
      return (
        <>
          <StyleButton
            title="Add Evacuation Site"
            onPress={() => navigation.navigate('AddEvacuationSite')}
          />
          <StyleButton
            title="Manage Sites"
            onPress={() => navigation.navigate('EvacuationSites')}
          />
          <StyleButton
            title="Map View"
            onPress={() => navigation.navigate('Map')}
          />
        </>
      );
    }

    const pending = requestStatus?.status === 'pending';
    return (
      <>
        <StyleButton
          title={pending ? "Application Pending" : "Apply as Site Manager"}
          onPress={() => navigation.navigate('ApplyManager')}
          className={`py-3 px-5 rounded-full w-full items-center mb-3 ${pending ? 'opacity-80' : ''}`}
          disabled={pending}
        />
        {requestStatus?.status && requestStatus?.status !== 'approved' && requestStatus?.status !== 'declined' && (
          <Text className="text-center text-gray-500 mb-3">
            Current request status: {requestStatus?.status?.toUpperCase?.() ?? ''}
          </Text>
        )}
        <StyleButton
          title="Evacuation Sites"
          onPress={() => navigation.navigate('EvacuationSites')}
        />
      </>
    );
  };

  return (
    <AppBackground>
      <View className="flex-1">
        <SafeAreaView className="flex-1">
          
            <View className="flex-row justify-start">
              <TouchableOpacity 
                  onPress={() => {
                    if (navigation.canGoBack()) {
                      navigation.goBack();
                    } else {
                      navigation.navigate('Home');
                    }
                  }}
                  className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                  <ArrowLeftIcon size="20" color="black"/>
              </TouchableOpacity>
            </View>

            {/* Centered profile area: logo above name; back arrow remains at top-left */}
            <View className="items-center mt-10 mb-8 w-full">
              <Image source={require('../assets/images/logo.png')} className="w-full h-[200]" resizeMode="contain" />
              <View className="flex-row items-center justify-center relative px-4"> 
            {editingField === 'name' ? (
                        <View className="flex-row items-center">
                            <StyleTextInput
                                value={tempValue}
                                onChangeText={setTempValue}
                                placeholder="Enter new name"
                                className="border p-2 w-48 mr-2" 
                            />
                            <StyleButton title="Save" onPress={() => handleSave('name')} />
                            <StyleButton title="X" onPress={() => setEditingField(null)} className="ml-2 bg-red-500" />
                        </View>
                    ) : (
                        <>
                            <Text className="text-3xl font-bold text-gray-800 tracking-wider">
                                {user?.username ?? userData.name}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1 uppercase">
                                {role}
                            </Text>
                            <TouchableOpacity 
                                onPress={() => handleEditStart('name', userData.name)} 
                                className="p-2 ml-2" 
                            >
                                <PencilSquareIcon color="#333" size={24}/>
                            </TouchableOpacity>
                        </>
                    )}
        </View>

        <View className="w-[300] h-1 bg-custom-orange rounded-full mt-3" />
      </View>

            <View className="w-full items-center">
              <View className="w-11/12">
                <ProfileEditCard
              label="Contact Number"
              fieldKey="contact" 
              value={userData.contact}
                        
                        
              isEditing={editingField === 'contact'}
              tempValue={tempValue}
              setTempValue={setTempValue}
                        
                       
              onPress={() => handleEditStart('contact', userData.contact)}
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
            />

              </View>

              <View className="w-11/12">
                <ProfileEditCard
              label="Password"
              fieldKey="password"
              value={userData.password}
              isPassword={true}

              isEditing={editingField === 'password'}
              empValue={tempValue}
              setTempValue={setTempValue}
                        
              onPress={() => handleEditStart('password', userData.password)}
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
            />
              </View>

              <View className="w-11/12 mt-4">
                {renderRoleActions()}
                <StyleButton title="LOG OUT" onPress={logOut} variant='secondaryClasses' className='py-3 px-5 rounded-full w-full items-center mb-3'/>
              </View>

            </View>

            <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      {user && (
        <View style={styles.card}>
          <Text style={styles.label}>Current User: {user.username}</Text>
          <Text style={styles.label}>Email: {user.email}</Text>
          <Text style={styles.label}>Role: {user.role}</Text>
        </View>
      )}
      <FlatList
        data={allUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{item.fullName}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userRole}>{item.role}</Text>
          </View>
        )}
      />
    </View>

          
        </SafeAreaView>
      </View>
    </AppBackground>
  );
}
