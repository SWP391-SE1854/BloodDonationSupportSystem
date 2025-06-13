import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAlv8EpE86eXsuo3lP4g6tUPbYg2RolazE",
    authDomain: "blooddonationsystem-f2379.firebaseapp.com",
    projectId: "blooddonationsystem-f2379",
    storageBucket: "blooddonationsystem-f2379.appspot.com",
    messagingSenderId: "796297565410",
    appId: "1:796297565410:web:0db3f0669011b980e27abb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 