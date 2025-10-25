import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/Auth'; 
import LoginScreen from '../screens/LogInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import MainScreen from '../screens/MainScreen';
import ApplyManagerScreen from '../screens/ApplyManagerScreen';
import EvacSiteDetailsScreen from '../screens/EvacSiteDetailsScreen';
import HomeScreen from '../screens/HomeScreen';
import AddEvacuationSiteScreen from '../screens/AddEvacuationSiteScreen';
import EvacuationSitesScreen from '../screens/EvacuationSitesScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          cardStyle: { backgroundColor: 'transparent' },
          headerShown: false,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: { opacity: current.progress },
          }),
        }}
      >
        {userToken == null ? (
          <>
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen} 
              options={{ title: 'Sign Up' }}
            />
           
          </>
        ) : (
          <>
            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="ApplyManager" component={ApplyManagerScreen}/>
            <Stack.Screen name="EvacSiteDetailsScreen" component={EvacSiteDetailsScreen}/>
            <Stack.Screen name="EvacSiteDetailsView" component={EvacSiteDetailsScreen}/>
            <Stack.Screen name="EvacuationSitesScreen" component={EvacuationSitesScreen}/>
          </>
        )}
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}