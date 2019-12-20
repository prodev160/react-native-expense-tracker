import firebase from 'firebase';
import 'firebase/firestore';
const config = {
    apiKey: "AIzaSyBWXh1nySI9tvDhPQSO5rhOJyqxlqqkelY",
    authDomain: "homefinance-jay.firebaseapp.com",
    databaseURL: "https://homefinance-jay.firebaseio.com",
    projectId: "homefinance-jay",
    storageBucket: "homefinance-jay.appspot.com",
    messagingSenderId: "500663699306",
    appId: "1:500663699306:web:1342cabad4a09d8f218713",
    measurementId: "G-E239BKVW0H"
  };

  // Initialize Firebase
  if (firebase.apps.length < 1)
    firebase.initializeApp(config);

  export const f = firebase;
  export const database = firebase.firestore();
  export const auth = firebase.auth();
  export const storage = firebase.storage();