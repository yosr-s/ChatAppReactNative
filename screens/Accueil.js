import { Button, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native'; // Import useRoute
import backgroundImage from "../assets/background.jpg"; // Change this line
import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profil from './Profil';
import ListProfil from './ListProfil';
import Group from './Group';




const Tab = createBottomTabNavigator();



export default function Accueil() {
    const route = useRoute(); // Use useRoute to access the route object
    const { email } = route.params;

  return (
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: 'black' },
        tabBarItemStyle: { backgroundColor: 'black' },
        tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
         }}>
                    <Tab.Screen name='Profil' component={Profil}  initialParams={{ email }}/>
                    <Tab.Screen name='ListProfil' component={ListProfil} initialParams={{ email }}/>
                    <Tab.Screen name='Group' component={Group} initialParams={{email}} />

      </Tab.Navigator>
 
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center', //alignement horizental
      justifyContent: 'center',
    },
    input:{
      height:60,
      width:"85%",
      borderRadius:5,
      textAlign:"center",
      backgroundColor:"#fff5",
      fontSize:16,
      marginTop:15,
      padding:10,
    }
  });