import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import backgroundImage from '../assets/background.jpg';
import { StatusBar } from 'expo-status-bar';
import { useRoute } from '@react-navigation/native';
import { onValue, ref } from 'firebase/database'; // Importez les fonctions nécessaires pour interagir avec Firebase depuis le fichier firebase.js
import { db } from '../Firebase/firebase'; // Importez la base de données

export default function Group({ navigation, route }) {
  const { params } = route;
  const { email } = params;
  const [groupsData, setGroupsData] = useState([]);

  const convertEmailToIdentifier = (email) => {
    return email.replace('.', '_');
  };

  useEffect(() => {
    const groupsRef = ref(db, 'groups'); // Utilisez la base de données 'db' que vous avez importée
    console.log('groupsRef', groupsRef);

    const unsubscribe = onValue(groupsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const groupsArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        console.log('groupsArray', groupsArray);
        console.log("group 0",groupsArray[0]);
      
        //const groupId= Object.keys(groupsArray[0])[1];
        //const group= groupsArray[0][groupId];
        //console.log("group",group);
        //console.log("groupmembers",group.members);


        // Filtrer les groupes pour n'afficher que ceux auxquels votre profil appartient
        const filteredGroups = groupsArray.filter((group) => {
          const groupId = Object.keys(group)[1];
          const grp = group[groupId];
          
        
          return grp.members.includes(convertEmailToIdentifier(email));

        }); 
     
        
        
        console.log('filteredGroups', filteredGroups);
        //console.log("members",filteredGroups[0].members);
         
           setGroupsData(filteredGroups);
      } else {
        setGroupsData([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [email]);

  const navigateToCreateGroup = () => {
    navigation.navigate('CreateGroup', { email: email });
  };
  const renderGroupItem = ({ item }) => {
    const groupKey = Object.keys(item)[1];
    const group = item[groupKey];

   

    const groupName = group.nom;
    console.log("groupKey",groupKey);
    console.log("item",item);
    console.log("group",group);
    console.log("groupName",groupName);
  
    return (
      <TouchableOpacity style={styles.groupItemContainer}  onPress={() => navigation.navigate("MessageGroup",{item:item,email:email})}>
        <Text style={styles.groupItemText}>{groupName}</Text>
      </TouchableOpacity>
    );
  };
  
  
  
  
  
  

  
  
  

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: 'black', height: 40, width: '100%' }}></View>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <TouchableOpacity style={styles.createGroupButton} onPress={navigateToCreateGroup}>
          <Text style={styles.createGroupButtonText}>Créer un nouveau groupe</Text>
        </TouchableOpacity>
        <Text style={{fontSize:20,marginBottom:20,fontWeight: 'bold'}}>La liste des groups:</Text>

        <FlatList data={groupsData} keyExtractor={(item) => item.id} renderItem={renderGroupItem} />
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
    padding: 20,
  },
  createGroupButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
  },
  createGroupButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  groupItemContainer: {
    backgroundColor: '#F8BBD0',
    padding: 16,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  groupItemText: {
    fontSize: 16,
  },
});
