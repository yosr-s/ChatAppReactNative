import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity, Image,TextInput  } from 'react-native';
import React, { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../Firebase/firebase';
import backgroundImage from "../assets/background.jpg";
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import Message from './Message'; // Import your Message screen component
import { useRoute } from '@react-navigation/native'; // Import useRoute




export default function ListProfil({ route }) {
  const navigation = useNavigation();
  const { params } = route;
  const { email } = params;

  const [profiles, setProfiles] = useState([]);
  const [states, setStates] = useState([]);


  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    const profilesRef = ref(db, 'profiles');
    const statesRef = ref(db, 'states');


    const unsubscribe = onValue(profilesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const profilesArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setProfiles(profilesArray);
      } else {
        setProfiles([]);
      }
    });
    const statesUnsubscribe = onValue(statesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const statesArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setStates(statesArray);
      } else {
        setStates([]);
      }
    });

    // Cleanup function
    return () => {
      unsubscribe();
      statesUnsubscribe();

    };
  }, []); // Empty dependency array ensures the effect runs only once

  const getUserState = (userId) => {
    const userState = states.find((state) => state.id === userId);
    return userState ? userState.state : 'disconnected';
  };
  

  const filteredProfiles = profiles.filter((profile) => {
    const fullName = `${profile.nom} ${profile.prenom}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={{backgroundColor:"black", height:40, width:"100%"}}></View>

      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
      >
        <Text style={styles.title}>Liste des Profils</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Recherche"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <View style={styles.flatListContainer}>
        <FlatList
            style={styles.flatList}
            data={filteredProfiles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.profileContainer}
                onPress={() => navigation.navigate('Message', { profile: item, email:email })}
              >
                  {item.imageUri && (
                  <Image source={{ uri: item.imageUri }} style={styles.profileImage} />
                )}
                <Text style={styles.label}>{`Nom:`}</Text>
                <Text style={styles.value}>{item.nom}</Text>

                <Text style={styles.label}>{`Prenom:`}</Text>
                <Text style={styles.value}>{item.prenom}</Text>

                <Text style={styles.label}>{`Telephone:`}</Text>
                <Text style={styles.value}>{item.telephone}</Text>

                <Text style={styles.label}>{`State:`}</Text>
                <Text style={styles.value}>{getUserState(item.id)}</Text>

              {/*  <Text style={styles.value}>{item.imageUri}</Text>*/}



             

                {/* Add more fields as needed */}
              </TouchableOpacity>
            )}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    color: 'black',
  },
  flatListContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatList: {
    width: '80%',
    padding: 10,
  },
  profileContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    width: '100%', // Adjusted width to be 100% for proper centering
    alignItems:'center'
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  profileImage: {
    width: 100, // Set the desired width
    height: 100, // Set the desired height
    borderRadius: 50, // Set half of the width/height to create a circle
    marginBottom: 10,

  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '80%',
    alignSelf: 'center',
  },
});
