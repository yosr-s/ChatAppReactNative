import { Button, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import backgroundImage from "../assets/background.jpg"; // Change this line
import { StatusBar } from 'expo-status-bar';
import { React,useRef, useState } from 'react'; 
import {app,auth} from '../Firebase/firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';










export default function Signup({navigation}) {
    const refInput2=useRef();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState(""); 
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleSignup = async () => {
      console.log("Handling signup...");
      console.log(email);
    
      if (password !== confirmPassword) {
        alert("Password and confirm password do not match");
        return;
      }
    
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        navigation.navigate("Accueil", { email: email });
      } catch (e) {
        console.log(e);
        alert(e.message);
      }
    };
    

  return (
    <View style={styles.container}>
        <StatusBar style="dark" />
        <ImageBackground source={backgroundImage} style={{height:"100%",width:"100%",flex:1,alignItems:"center",justifyContent:"center"}}>
        <Text style={{fontSize:32,fontWeight:"bold",marginTop:30,marginBottom:30, color:"#7CB342"}}>Créez votre compte! </Text>

            <View style={{backgroundColor:"#0005", width:"85%",height:400 , borderRadius:10,alignItems:"center"}}>
                 <Text style={{fontSize:32,fontWeight:"bold", marginTop:20,marginBottom:40 ,color:"#7CB342"}}>Sign Up</Text>
                 <TextInput style={styles.input} 
                       placeholder='email' 
                       keyboardType='email-address'
                       value={email}
                       onSubmitEditing={()=>{refInput2.current.focus();}}
                       blurOnSubmit={false}
                       onChangeText={(text)=>{setEmail(text)}}>
                </TextInput>
                 <TextInput style={styles.input} 
                       placeholder='password' 
                       value={password}
                       keyboardType='default'
                       secureTextEntry={true}
                       ref={refInput2}
                       onChangeText={(text)=>{setPassword(text)}}>
                 </TextInput>
                 <TextInput
                        style={styles.input}
                        placeholder='confirm password'
                        value={confirmPassword}
                        keyboardType='default'
                        secureTextEntry={true}
                        onChangeText={(text) => { setConfirmPassword(text) }}>
                    </TextInput>

             {/* <Button title="Sign In"></Button> */}
            <TouchableOpacity
            style={{
              backgroundColor: '#7CB342',
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 5,
              marginTop: 15,
              marginBottom:15
            }}
            onPress={handleSignup}
          
          >
            
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Sign Up</Text>
          </TouchableOpacity>

            </View>

         
        </ImageBackground>

   

    </View>
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