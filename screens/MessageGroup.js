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

export default function MessageGroup({ navigation}) {
    const [senderNames, setSenderNames] = useState({});
    const fetchSenderName = async (senderId) => {
        // Assuming you have a 'profiles' collection in Firebase
        const profilesRef = ref(db, 'profiles');
        const snapshot = await get(profilesRef, senderId);
      
        if (snapshot.exists()) {
          const profileData = snapshot.val();
          const senderName = `${profileData.nom} ${profileData.prenom}`;
          return senderName;
        } else {
          return null;
        }
      };
      
    const route = useRoute(); // Use useRoute to access the route object
    const { item } = route.params;
    const { email } = route.params;
    const scrollViewRef = useRef();

    const groupKey = Object.keys(item)[1];
    const group = item[groupKey];

    // Function to scroll to the end
    const scrollToBottom = () => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    };
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesRef = ref(db, 'messagesgroup');

    const handleSend = async () => {
        console.log("Handling send..."); // Add this line
        //console.log(message); // Add this line
        //console.log(email); // Add this line
        //console.log(profile.id); // Add this line
        //console.log("Route params:", route.params);
    
        if (message.trim() === '') {
          return;
        }
    
        const newMessageRef = push(messagesRef);
        const newMessageKey = newMessageRef.key;

        const groupKey = Object.keys(item)[1];
        const group = item[groupKey];

    
        const newMessage = {
          id: newMessageKey,
          text: message,
          sender: convertEmailToIdentifier(email), // Assuming email is the sender
          receiver: group,
          timestamp: serverTimestamp(),
        };
        console.log("New message:", newMessage);
        console.log("sender:", newMessage.sender);
        console.log("receiver:", newMessage.receiver);
    
        try {
          await push(newMessageRef, newMessage);
          setMessage('');
        } catch (error) {
          console.error("Error sending message:", error);
        }
      };

      const renderMessages = () => {
        return messages.map((msgObj) => {
          const messageId = Object.keys(msgObj)[1];
          const msg = msgObj[messageId];
      
          const isMyMessageSent = msg.sender === convertEmailToIdentifier(email);
          const isMyMessageReceived = !(msg.sender === convertEmailToIdentifier(email));
      
          // Check if the message belongs to the current group
          const belongsToCurrentGroup = msg.receiver.nom === group.nom;
      
          console.log("Message:", msg);
          console.log("belongsToCurrentGroup:", belongsToCurrentGroup);
          console.log("isMyMessageSent:", isMyMessageSent);
          console.log("isMyMessageReceived:", isMyMessageReceived);
      
          if (!belongsToCurrentGroup) {
            return null; // Skip rendering for messages from other groups
          }
      
          return (
            <View key={msg.id}>
            {isMyMessageReceived && (
              <Text style={styles.senderName}>{msg.sender}</Text>
            )}
    
            <View
              style={[
                styles.messageContainer,
                isMyMessageSent ? styles.myMessageContainer : isMyMessageReceived ? styles.theirMessageContainer : null,
              ]}
            >
              <Text style={isMyMessageSent ? styles.myMessageText : styles.theirMessageText}>{msg.text}</Text>
            </View>
          </View>
          );
        });
      };
      
    

      const convertEmailToIdentifier = (email) => {
        return email.replace('.', '_');
      };

      useEffect(() => {
        const groupKey = Object.keys(item)[1];
        const group = item[groupKey];
      
        const unsubscribe = onValue(messagesRef, async (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const messagesArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      
            // Fetch sender names
            const namesPromises = messagesArray.map(async (msg) => {
              if (msg.sender && !senderNames[msg.sender]) {
                const senderName = await fetchSenderName(msg.sender);
                setSenderNames((prevNames) => ({
                  ...prevNames,
                  [msg.sender]: senderName,
                }));
              }
            });
      
            await Promise.all(namesPromises);
      
            setMessages(messagesArray);
            scrollToBottom(); // Scroll to the bottom when new messages are received
          } else {
            setMessages([]);
          }
        });
      
        return () => {
          unsubscribe();
        };
      }, [messagesRef, senderNames, item]);
      
    
      const behavior = Platform.OS === 'ios' ? 'padding' : 'height';    
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
        <Text style={styles.headerText}>{`                    DM ${group.nom}`}</Text>

                 


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
      </View> 
      </ImageBackground>
    </KeyboardAvoidingView>
  )
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
    
  });
  