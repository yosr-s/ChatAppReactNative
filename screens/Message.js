import React, { useState, useEffect,useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,ImageBackground,Linking,Image  } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { db } from '../Firebase/firebase';
import { useRoute } from '@react-navigation/native'; // Import useRoute
import { FlatList } from 'react-native';
import backgroundImage from "../assets/background.jpg"; // Change this line
import call from "../assets/call.png"; // Change this line
import galerie from "../assets/galerie.png"; // Change this line

//import * as DocumentPicker from 'react-native-document-picker';
//import FilePickerManager from 'react-native-file-picker';
import * as ImagePicker from 'expo-image-picker';










export default function Message() {
  const handleCall = (phoneNumber) => {
    const phoneURL = `tel:${phoneNumber}`;
    Linking.openURL(phoneURL);
  };
  const scrollViewRef = useRef();

  // Function to scroll to the end
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };
    const route = useRoute(); // Use useRoute to access the route object
  const { profile } = route.params;
  const { email } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);


  const messagesRef = ref(db, 'messages');

  const handleSend = async () => {
    if (!message.trim() && !selectedImage) {
      return;
    }
  
    const newMessageRef = push(messagesRef);
    const newMessageKey = newMessageRef.key;
  
    const newMessage = {
      id: newMessageKey,
      text: message.trim(),
      image: selectedImage || null,
      sender: convertEmailToIdentifier(email),
      receiver: profile.id,
      timestamp: serverTimestamp(),
    };
  
    try {
      await push(newMessageRef, newMessage);
      setMessage('');
      setSelectedImage(null); // Clear selected image after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

  const renderMessages = () => {
    return messages.map((msgObj) => {
      const messageId = Object.keys(msgObj)[1];
      const msg = msgObj[messageId];
  
      const isMyMessageSent = convertEmailToIdentifier(msg.sender) === convertEmailToIdentifier(email) && convertEmailToIdentifier(msg.receiver) === profile.id;
      const isMyMessageReceived = msg.sender === profile.id && msg.receiver === convertEmailToIdentifier(email);
  
      console.log("Message:", msg);
      console.log("isMyMessageSent:", isMyMessageSent);
      console.log("isMyMessageReceived:", isMyMessageReceived);
  
      if ((isMyMessageSent || isMyMessageReceived) && (msg.image || msg.text.trim() !== '')) {
        return (
          <View
            key={msg.id}
            style={[
              styles.messageContainer,
              isMyMessageSent ? styles.myMessageContainer : styles.theirMessageContainer,
            ]}
          >
            {msg.image ? (
              <Image source={{ uri: msg.image }} style={styles.messageImage} />
            ) : (
              <Text style={isMyMessageSent ? styles.myMessageText : styles.theirMessageText}>{msg.text}</Text>
            )}
          </View>
        );
      }
  
      return null; // Message doesn't meet conditions, so don't render anything
    });
  };
  
  
  
  

  
  
  
  const convertEmailToIdentifier = (email) => {
    return email.replace('.', '_');
  };
  

  useEffect(() => {
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setMessages(messagesArray);
        scrollToBottom(); // Scroll to the bottom when new messages are received

      } else {
        setMessages([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [messagesRef]);

  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';

  //select doc
  const SelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        const newMessageRef = push(messagesRef);
        const newMessageKey = newMessageRef.key;
  
        const newMessage = {
          id: newMessageKey,
          text: "", // You can set an empty text if needed
          image: result.uri,
          sender: convertEmailToIdentifier(email),
          receiver: profile.id,
          timestamp: serverTimestamp(),
        };
  
        try {
          await push(newMessageRef, newMessage);
          setMessage('');
          setSelectedImage(null); // Clear selected image after sending
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };
  
   


 

  return (
    <KeyboardAvoidingView style={styles.container} behavior={behavior}>
       <ImageBackground 
      source={backgroundImage}
      style={{height:"100%",width:"100%"}}
      >
      <StatusBar style="light" />
      <View style={{ backgroundColor: 'black', height: 40, width: '100%' }}></View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{`                    DM ${profile.nom} ${profile.prenom}`}</Text>

                 
  <View style={styles.headerRight}>
  <TouchableOpacity
    style={styles.callButton}
    onPress={() => handleCall(profile.telephone)}
  >
    <Image
      source={call} // Replace with the actual path to your icon
      style={styles.callButtonImage}
    />
  </TouchableOpacity>
</View>

      </View>
     

      <ScrollView style={styles.messageContainer}  ref={scrollViewRef}
      onContentSizeChange={() => {
        scrollToBottom();
      }}>
    
        <ScrollView>
        {renderMessages()} 
        </ScrollView>
      </ScrollView>

      

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
      
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity
    style={styles.callButton}
    onPress={SelectImage}
  >
    <Image
      source={galerie} // Replace with the actual path to your icon
      style={styles.callButtonImage}
    />
  </TouchableOpacity>

      </View>
      
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    height: 60,
    width: '100%',
    paddingHorizontal: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  messageContainer: {
    flex: 1,
    padding: 10,
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#F8BBD0',
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  myMessageText: {
    fontSize: 16,
    padding: 10,
    color: '#333',
  },
  theirMessageText: {
    fontSize: 16,
    padding: 10,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginBottom: 30,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingLeft: 10,
    color: 'white',
  },
  sendButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  callButton: {
    backgroundColor: 'white',
    paddingVertical: 1,
    paddingHorizontal: 1,
    borderRadius: 5,
  },
  callButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  callButtonImage: {
    width: 40, // Adjust the width to fit your icon size
    height: 40, // Adjust the height to fit your icon size
    resizeMode: 'contain',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 5,
  },
  
  
});
