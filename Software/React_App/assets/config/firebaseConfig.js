// firebaseConfig.js
import firebase from 'firebase/compat/app';
import {getDatabase} from 'firebase/database'; // 


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "API_KEY_HERE",
  authDomain: "simple-sprouts-database.firebaseapp.com",
  databaseURL: "https://simple-sprouts-database-default-rtdb.firebaseio.com",
  projectId: "simple-sprouts-database",
  storageBucket: "simple-sprouts-database.firebasestorage.app",
  messagingSenderId: "991099523914",
  appId: "1:991099523914:web:d6b6c4b0ed302115f627b3",
  measurementId: "G-B523WSHQKF"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Use the already initialized app
}

const database = getDatabase();

export { database };