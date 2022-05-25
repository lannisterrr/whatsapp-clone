// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyADIiGq-A5f8kc4BhgXgtHvnA0Q5IN2tQk',
  authDomain: 'whatsapp-clone-a6517.firebaseapp.com',
  projectId: 'whatsapp-clone-a6517',
  storageBucket: 'whatsapp-clone-a6517.appspot.com',
  messagingSenderId: '347440481574',
  appId: '1:347440481574:web:38e60b8282db98a272ade7',
  measurementId: 'G-5CF4GD5XR6',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();
const storage = getStorage(app);
const imageStorage = ref(storage, 'images');
const audioStorage = ref(storage, 'audios');
const db = getFirestore(app);
const database = getDatabase(app);
const auth = getAuth(app);
const createTimeStamp = firebase.firestore.FieldValue.serverTimestamp;
const serverTimestamp = firebase.firestore.ServerValue.TIMESTAMP;
export {
  db,
  storage,
  auth,
  database,
  provider,
  imageStorage,
  audioStorage,
  createTimeStamp,
  serverTimestamp,
};
