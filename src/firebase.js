import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const app = firebase.initializeApp({
	apiKey: 'AIzaSyCP5lViOfuN6JjURzK4riWrSSjS96VYP1U',
	authDomain: 'capturetheflag-mw.firebaseapp.com',
	projectId: 'capturetheflag-mw',
	storageBucket: 'capturetheflag-mw.appspot.com',
	messagingSenderId: '613284057612',
	appId: '1:613284057612:web:7702f5c4bde3bfdad71429',
});

export const auth = app.auth();
export const db = app.firestore();
export const storageRef = app.storage().ref();
export default app;
