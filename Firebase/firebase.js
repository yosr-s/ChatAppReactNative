import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
//import { getStorage, ref, uploadBytes } from "firebase/storage";
//import storage from '@react-native-firebase/storage';
import "firebase/storage";







const firebaseConfig = {
  apiKey: "AIzaSyCxFDNsxAgXQml0Jhg6bATnTrrExWyhEgE",
  authDomain: "gestionprofil-d4991.firebaseapp.com",
  projectId: "gestionprofil-d4991",
  storageBucket: "gestionprofil-d4991.appspot.com",
  messagingSenderId: "152506700856",
  appId: "1:152506700856:web:bd0324a6e66b39ff5c82cd",
  measurementId: "G-LEWLFWGYPS"   
};
  
  


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Access authentication methods
const auth = getAuth(app);
const db = getDatabase(app);
//const storage = getStorage(app);
//const storageRef = ref(storage, 'some-child');




export {app,auth,db};