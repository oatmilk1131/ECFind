import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/Auth';

import LogInScreen from '../screens/LogInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainScreen from '../screens/MainScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import AddEvacuationSiteScreen from '../screens/AddEvacuationSiteScreen';
import EvacuationSitesScreen from '../screens/EvacuationSitesScreen';
import EvacSiteDetailsScreen from '../screens/EvacSiteDetailsScreen';
import ChangeSiteManagerScreen from '../screens/ChangeSiteManagerScreen';
import ApplyManagerScreen from '../screens/ApplyManagerScreen';
import DeveloperMenu from '../screens/DeveloperMenu';
import UserProfileScreen from '../screens/UserProfileScreen';
import RegistrationRequests from '../screens/RegistrationRequests';
import DeleteEvacuationSites from '../screens/DeleteEvacuationSites';

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Main" component={MainScreen} />
      <AuthStack.Screen name="Login" component={LogInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  const getInitialRoute = () => {
    if (!user) return 'Home';
    if (user.username?.toLowerCase() === 'antwone') {
      return 'Developer';
    }
    return 'Home';
  };

  if (isLoading) return null;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen 
            name="App" 
            options={{ animationEnabled: false }}
          >
            {() => (
              <AppStack.Navigator
                initialRouteName={getInitialRoute()}
                screenOptions={{ headerShown: false }}
              >
                <AppStack.Screen name="Home" component={HomeScreen} />
                <AppStack.Screen name="Map" component={MapScreen} />
                <AppStack.Screen name="AddEvacuationSite" component={AddEvacuationSiteScreen} />
                <AppStack.Screen name="EvacuationSites" component={EvacuationSitesScreen} />
                <AppStack.Screen name="EvacSiteDetails" component={EvacSiteDetailsScreen} />
                <AppStack.Screen name="ChangeSiteManager" component={ChangeSiteManagerScreen} />
                <AppStack.Screen name="ApplyManager" component={ApplyManagerScreen} />
                <AppStack.Screen name="Developer" component={DeveloperMenu} />
                <AppStack.Screen name="UserProfile" component={UserProfileScreen} />
                <AppStack.Screen name="RegistrationRequests" component={RegistrationRequests} />
                <AppStack.Screen name="DeleteEvacuationSites" component={DeleteEvacuationSites} />
              </AppStack.Navigator>
            )}
          </RootStack.Screen>
        ) : (
          <RootStack.Screen 
            name="Auth" 
            component={AuthStackScreen}
            options={{ animationEnabled: false }}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
