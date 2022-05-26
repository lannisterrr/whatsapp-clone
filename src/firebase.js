// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';
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
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage().ref('images');
const audioStorage = firebase.storage().ref('audio');
const createTimeStamp = firebase.firestore.FieldValue.serverTimestamp;
const serverTimestamp = firebase.database.ServerValue.TIMESTAMP;

export {
  db,
  storage,
  auth,
  serverTimestamp,
  provider,
  audioStorage,
  createTimeStamp,
};
