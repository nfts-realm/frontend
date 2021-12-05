import firebase from "firebase/app";
import "firebase/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPzu1DWHkZrzxe1V1fh4Vhmo9T2vwEL8U",
  authDomain: "fir-10c03.firebaseapp.com",
  projectId: "fir-10c03",
  storageBucket: "fir-10c03.appspot.com",
  messagingSenderId: "708717598444",
  appId: "1:708717598444:web:f7b43c38cf3c03aae477c9",
  measurementId: "G-FJZLLXGP4S",
};
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
const myfirebase = firebase.firestore();

export default myfirebase;
