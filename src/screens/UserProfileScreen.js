import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../context/Auth';
import StyleButton from '../components/StyleButton';
import AppBackground from '../components/AppBackground';
import {ArrowLeftIcon, PencilSquareIcon} from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyleTextInput from '../components/StyleTextInput';
import ProfileEditCard from '../components/ProfileEdit';


export default function UserProfileScreen({navigation}) {

  const { signOut } = useAuth();

  const [userData, setUserData] = useState ({
    name: "MONAELSA",
    contact: "213141",
    password: "DIAKOMAGTURO"
  });

  
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

  return (
    <AppBackground>
      <View className="flex-1">
        <SafeAreaView className="flex-1">
          
            <View className="flex-row justify-start">
              <TouchableOpacity 
                  onPress={() => navigation.navigate('HomeScreen')}
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
                                {userData.name}
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
                <StyleButton title="Apply as site manager" onPress={() => navigation.navigate('ApplyManager')} className='py-3 px-5 rounded-full w-full items-center mb-3'/>
                <StyleButton title="Evacuation Sites" onPress={() => navigation.navigate('EvacuationSitesScreen')} className='py-3 px-5 rounded-full w-full items-center mb-3'/>  
                <StyleButton title="LOG OUT" onPress={signOut} variant='secondaryClasses' className='py-3 px-5 rounded-full w-full items-center mb-3'/>
              </View>

            </View>

          
        </SafeAreaView>
      </View>
    </AppBackground>
  );
}