import { Button, ImageBackground, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import backgroundImage from "../assets/background.jpg"; // Change this line
import profile from "../assets/profile.png";
import { ref, set, get } from 'firebase/database';
import { useRoute } from '@react-navigation/native';
import { db } from '../Firebase/firebase';
import * as ImagePicker from 'expo-image-picker';


export default function Profil({ route,navigation }) {
  const { params } = route;
  const { email } = params;

  const refInput2 = useRef();
  const refInput3 = useRef();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTel] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [imageUri, setImageUri] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = email.replace('.', '_');
        const profileRef = ref(db, 'profiles/' + userId);
        const snapshot = await get(profileRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setNom(data.nom || "");
          setPrenom(data.prenom || "");
          setTel(data.telephone || "");
          setImageUri(data.imageUri || null); // Update with the key used in the database
        } else {
          setNom("");
          setPrenom("");
          setTel("");
          setImageUri(null);
        }
      } catch (error) {
        console.error('Error fetching profile: ', error.message);
      }
    };
    
  
    fetchData();
    
  }, [email]);
  
  const saveProfile = async () => {
    try {
      const profileData = {
        nom,
        prenom,
        telephone,
        imageUri, // Add the image URI to the profile data
      };
  
      const userId = email.replace('.', '_');
      const profileRef = ref(db, 'profiles/' + userId);
      await set(profileRef, profileData);
  
      console.log('Profile updated for email: ', email);
    } catch (error) {
      console.error('Error saving profile: ', error.message);
    }
  };
  const SignOut = async () => {
    try {
      const StateData = {
        state:'disconnected',
      };
      console.log('state: ', StateData.state);
  
      const stateId = email.replace('.', '_');
      const stateRef = ref(db, 'states/' + stateId);
      await set(stateRef, StateData);
      navigation.navigate("signin");
  
      console.log('state updated: ', StateData.state);
    } catch (error) {
      console.error('Error updating state: ', error.message);
    }
  };
  

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        // The selected image URI is in result.uri
        setImageUri(result.uri);
      }
    } catch (error) {
      console.error('Error picking image: ', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={{backgroundColor:"black", height:40, width:"100%"}}></View>

      <ImageBackground source={backgroundImage} style={{ height: "100%", width: "100%", flex: 1, alignItems: "center", justifyContent: "flex-start" }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", marginTop: 30, marginBottom: 30, color: "black" }}></Text>
        <TouchableOpacity onPress={SignOut}  style={{
              backgroundColor: 'black',
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 5,
              marginTop: 15,
              marginBottom: 15
            }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Sign Out</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: "#0008", width: "85%", height: 500, borderRadius: 10, alignItems: "center" }}>
          {/*<Image source={profile} style={{ height: 150, width: 150, alignItems: "center", justifyContent: "flex-start" }} />*/}
          

         

          <TouchableOpacity onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={{ height: 150, width: 150, alignItems: "center", justifyContent: "flex-start",borderRadius: 75,marginTop:30 }} />
            ) : (
              <Image source={profile} style={{ height: 150, width: 150, alignItems: "center", justifyContent: "flex-start" }} />
            )}
          </TouchableOpacity>



          <TextInput style={styles.input}
            placeholder='saisir votre nom'
            keyboardType='default'
            onSubmitEditing={() => { refInput2.current.focus(); }}
            blurOnSubmit={false}
            onChangeText={(text) => { setNom(text) }}
            value={nom}
          />
          <TextInput style={styles.input}
            placeholder='saisir votre prenom'
            keyboardType='default'
            onSubmitEditing={() => { refInput3.current.focus(); }}
            ref={refInput2}
            blurOnSubmit={false}
            onChangeText={(text) => { setPrenom(text) }}
            value={prenom}
          />
          <TextInput style={styles.input}
            placeholder='saisir votre telephone'
            keyboardType='default'
            ref={refInput3}
            onChangeText={(text) => { setTel(text) }}
            value={telephone}
          />
          <TouchableOpacity
            style={{
              backgroundColor: 'black',
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 5,
              marginTop: 15,
              marginBottom: 15
            }}
            onPress={saveProfile}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Save</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 60,
    width: "85%",
    borderRadius: 5,
    textAlign: "center",
    backgroundColor: "#FFF9",
    borderRadius: 30,
    fontSize: 16,
    marginTop: 15,
    padding: 10,
  }
});
