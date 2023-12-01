import { StatusBar } from 'expo-status-bar';
import { Button, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import backgroundImage from "../assets/background.jpg"; // Change this line
import { useRef, useState ,useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth,db } from '../Firebase/firebase';
import { useRoute } from '@react-navigation/native'; // Import useRoute
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ref, set, get } from 'firebase/database';



export default function Authentification({navigation}) {
 

  
 
  
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const refInput2=useRef();
  //const navigation = useNavigation();
  const handleSignin = async () => {
    console.log("Handling signin..."); // Add this line
    console.log(email); // Add this line
    saveState();

    try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    saveState();
      navigation.navigate("Accueil",{email:email});
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  
  };
  const saveState = async () => {
    try {
      const StateData = {
        state:'connected',
      };
      console.log('state: ', StateData.state);
  
      const stateId = email.replace('.', '_');
      const stateRef = ref(db, 'states/' + stateId);
      await set(stateRef, StateData);
  
      console.log('state updated: ', StateData.state);
    } catch (error) {
      console.error('Error updating state: ', error.message);
    }
  };
 
  
 
 

  return (
    <View style={styles.container}>

      <StatusBar style="light" />
      <View style={{backgroundColor:"black", height:40, width:"100%"}}></View>

      <ImageBackground 
      source={backgroundImage}
      style={{height:"100%",width:"100%",flex:1,alignItems:"center",justifyContent:"center"}}
      >
        <View style={{backgroundColor:"#0005", width:"85%",height:350 , borderRadius:10,alignItems:"center"}}>
            <Text style={{fontSize:32,fontWeight:"bold", marginTop:30, color:"black"}}>Sign In</Text>
            <TextInput style={styles.input} 
                       placeholder='email' 
                       keyboardType='email-address'
                       onSubmitEditing={()=>{refInput2.current.focus();}}
                       blurOnSubmit={false}
                       onChangeText={(text)=>{setEmail(text)}}>
            </TextInput>
            <TextInput style={styles.input} 
                       placeholder='password' 
                       keyboardType='default'
                       secureTextEntry={true}
                       ref={refInput2}
                       onChangeText={(text)=>{setPassword(text)}}>
            </TextInput>
             {/* <Button title="Sign In"></Button> */}
            <TouchableOpacity
            style={{
              backgroundColor: 'black',
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 5,
              marginTop: 15,
              marginBottom:15
            }}
            onPress={handleSignin}

          
          >
            
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Sign In</Text>
          </TouchableOpacity>
        
            <TouchableOpacity style={{width:"82%",alignItems:"flex-end"}}>
                <Text 
                style={{color:"white" , fontWeight:"bold"}}
                onPress={()=>{navigation.navigate('Signup')}}
                >
                  Create new user
                </Text>
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
    color:"white"
  }
});
