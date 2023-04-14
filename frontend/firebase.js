import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCARo8IWnyAH9WPZlA9j63i1mtSJlU_f74",
  authDomain: "miami-hackathon-ai.firebaseapp.com",
  projectId: "miami-hackathon-ai",
  storageBucket: "miami-hackathon-ai.appspot.com",
  messagingSenderId: "480223531817",
  appId: "1:480223531817:web:f62b9a6cd8be70e5cd9d38",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();
