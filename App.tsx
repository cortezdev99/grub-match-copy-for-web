import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase/app'
import 'firebase/auth'
import { StatusBar } from 'react-native'
import * as Font from 'expo-font'


import HomeScreen from './screens/HomeScreen'
import FriendScreen from './screens/FriendScreen'
import DuoMatchScreen from './screens/DuoMatchScreen';
import SettingsScreen from './screens/SettingsScreen';
import { dark } from './Styles/variables';
import HeaderLogo from './Components/images/HeaderLogo';
import AuthScreen from './screens/auth/AuthScreen';
import LoadingScreen from './screens/loading/LoadingScreen';
import { firebaseApp } from './config/fbConfig'
import MultiParty from './screens/MultiPary';
import MultiPartyDetails from './screens/MultiPartyDetails';
import DevInfoScreen from './screens/DevInfoScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import HeaderLogoWithButtons from './Components/images/HeaderLogoWithButtons';
import HomeScreenProvider from './providers/HomeScreenProvider';

firebase.auth()

const Stack = createStackNavigator();
const homeScreenOptions = {
  headerStyle: {
    backgroundColor: dark,
    shadowColor: 'transparent'
  },
  headerTintColor: "white",
  headerTitleAlign: "center",
  headerTitle: () => <HeaderLogoWithButtons />
}

const options = {
  headerStyle: {
    backgroundColor: dark,
    shadowColor: 'transparent'
  },
  headerTintColor: "white",
  headerTitleAlign: "center",
  headerTitle: () => <HeaderLogo />
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [user, setUser] = useState(false);

  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    } 
  }

  useEffect(() => {
    Font.loadAsync({
      'normal': require('./assets/fonts/BalooBhai2-Regular.ttf'),
      'normal-medium': require('./assets/fonts/BalooBhai2-Medium.ttf'),
      'normal-semi-bold': require('./assets/fonts/BalooBhai2-SemiBold.ttf'),
      'fancy-regular': require('./assets/fonts/Srisakdi-Regular.ttf'),
      'fancy-bold':  require('./assets/fonts/Srisakdi-Bold.ttf')
    }).then(() => {
      setFontsLoaded(true)
      firebaseApp
      const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; // unsubscribe on unmount
    }).catch(() => {
      alert('You seem to be having internet issues right now. Reload the app and try again.')
    })
  }, []);

  const stacksToBeRendered = () => {
    if (user) {
      return (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={homeScreenOptions} />
          <Stack.Screen name="Friends" component={FriendScreen} options={options} />
          <Stack.Screen name="DuoMatch" component={DuoMatchScreen} options={options} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={options} />
          <Stack.Screen name="MultiParty" component={MultiParty} options={options} />
          <Stack.Screen name="MultiPartyDetails" component={MultiPartyDetails} options={options} />
          <Stack.Screen name="DevInfo" component={DevInfoScreen} options={options} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} options={options} />
        </Stack.Navigator>
      )
    } else if (!user && initializing || !fontsLoaded) {
      return <LoadingScreen />
    } else {
      return (
        <Stack.Navigator initialRouteName="Auth">
          <Stack.Screen name="Auth" component={AuthScreen} options={options} />
        </Stack.Navigator>
      )
    }
  }
  
  return (
    <NavigationContainer>
      <HomeScreenProvider>
        <StatusBar barStyle="light-content" />
        { stacksToBeRendered() }
      </HomeScreenProvider>
    </NavigationContainer>
  );
}
