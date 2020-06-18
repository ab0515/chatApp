import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import config from '../util/config';

firebase.initializeApp(config);
export const auth = firebase.auth();
export const db = firebase.firestore();
