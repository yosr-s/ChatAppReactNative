import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import backgroundImage from '../assets/background.jpg';
import { StatusBar } from 'expo-status-bar';
import ModalDropdown from 'react-native-modal-dropdown';
import { ref, push, onValue, getDatabase } from 'firebase/database';
import { db } from '../Firebase/firebase';
import { useRoute } from '@react-navigation/native'; // Import useRoute


export default function CreateGroup() {
  const route = useRoute();
  const { params } = route;
  const { email } = params;
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [groupName, setGroupName] = useState('');
  const convertEmailToIdentifier = (email) => {
    return email.replace('.', '_');
  };

  useEffect(() => {
    const database = getDatabase();
    const profilesRef = ref(database, 'profiles');

    const unsubscribe = onValue(profilesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const profilesArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setProfiles(profilesArray);
          // Ajouter votre propre profil par défaut
      const myProfile = profilesArray.find((profile) => profile.id === convertEmailToIdentifier(email)); // Remplacez par votre email
      console.log("email",email);
      console.log('myProfile', myProfile);

      if (myProfile) {
        setSelectedProfiles([myProfile]);
      }
      } else {
        setProfiles([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName) {
      console.error('Please enter a group name');
      alert('please enter a group name');
      return;
    }

    if (selectedProfiles.length === 0) {
      console.error('Please select at least one profile');
      alert('please select at least one profile');
      return;
    }

    const groupsRef = ref(db, 'groups');
    const newGroupRef = push(groupsRef);

    const newGroup = {
      nom: groupName,
      members: selectedProfiles.map((profile) => profile.id),
    };

    try {
      await push(newGroupRef, newGroup);
      console.log('Group created successfully:', newGroup);
      // Navigate back to the previous screen
      navigation.navigate('Group', { email: email });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}></View>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create Group</Text>

        <TextInput
          style={styles.input}
          placeholder="Group Name"
          value={groupName}
          onChangeText={(text) => setGroupName(text)}
        />

        {/* Display selected profiles */}
        {selectedProfiles.length > 0 && (
  <View style={styles.selectedProfilesContainer}>
    <Text style={styles.selectedProfilesTitle}>Selected Profiles:</Text>
    <FlatList
      data={selectedProfiles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.selectedProfileItem}>
          <Text>{`${item.nom} ${item.prenom}`}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              // Retirer le profil de la liste des profils sélectionnés
              const updatedProfiles = selectedProfiles.filter((profile) => profile.id !== item.id);
              setSelectedProfiles(updatedProfiles);
            }}
          >
            <Text style={styles.removeButtonText}>Retirer</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  </View>
)}

        <View style={styles.dropdownContainer}>
          <ModalDropdown
            options={profiles.map((profile) => `${profile.nom} ${profile.prenom}`)}
            defaultValue="Select Profiles"
            onSelect={(index, value) => {
              const selectedProfile = profiles[index];
              setSelectedProfiles([...selectedProfiles, selectedProfile]);
            }}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownDropdown}
            dropdownTextStyle={styles.dropdownText}
            dropdownTextHighlightStyle={styles.dropdownTextHighlight}
          />
        </View>

        <TouchableOpacity style={styles.createGroupButton} onPress={handleCreateGroup}>
          <Text style={styles.createGroupButtonText}>Create Group</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'black',
    height: 40,
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 50,
    left: 100,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 35,
    paddingLeft: 10,
    color: 'white',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  dropdownDropdown: {
    borderRadius: 5,
  },
  dropdownTextHighlight: {
    color: 'blue',
  },
  createGroupButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
  },
  createGroupButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedProfilesContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  selectedProfilesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedProfileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5, 
   },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
 
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
  },
});
