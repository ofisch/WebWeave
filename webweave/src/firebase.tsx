// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLp89zv11YwYc1Za_h7xDEBu3WD9QFTKY",
  authDomain: "webweave-54aff.firebaseapp.com",
  projectId: "webweave-54aff",
  storageBucket: "webweave-54aff.appspot.com",
  messagingSenderId: "757793155296",
  appId: "1:757793155296:web:4043246c5a5ca3a3550885",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
