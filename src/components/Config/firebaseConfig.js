import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyCf8c_lL6oQ6ShiHqrRVNT-w76ZIx7W178",
    authDomain: "digitalsignage-21521774.firebaseapp.com",
    databaseURL: "https://digitalsignage-21521774-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "digitalsignage-21521774",
    storageBucket: "digitalsignage-21521774.appspot.com",
    messagingSenderId: "1005072885556",
    appId: "1:1005072885556:web:5b1b3984db9b5a393b6761",
    measurementId: "G-JZWRR6STYE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
//export cái firebaseConfig ra ngoài để App.jsx nhận
export const db = getFirestore(app);
export const auth = getAuth(app);
export default firebaseConfig;