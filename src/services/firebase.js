import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import config from '../util/config';

firebase.initializeApp(config);
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
