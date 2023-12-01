import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import Authentification from './screens/Authentification'
import Accueil from './screens/Accueil';
import Signup from './screens/Signup';
import Message from './screens/Message';
import CreateGroup from './screens/CreateGroup';
import MessageGroup from './screens/MessageGroup';

const Stack = createNativeStackNavigator();


export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="signin"  screenOptions={{
          headerShown: false, // Set headerShown to false to remove AppBar
          headerStyle: { backgroundColor: 'black' }, // Set the background color of the header
          headerTintColor: 'white', // Set the text color of the header
          headerTitleStyle: { fontWeight: 'bold' }, // Set the font weight of the header title
        }}>
        <Stack.Screen name="signin" component={Authentification} />
        <Stack.Screen name="Accueil" component={Accueil} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Message" component={Message} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="MessageGroup" component={MessageGroup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}