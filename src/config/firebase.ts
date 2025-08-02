import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCIwjptljZut1JaUPBd_rWxpBpTR0mCkVk",
  authDomain: "anandrealestate-703bc.firebaseapp.com",
  projectId: "anandrealestate-703bc",
  storageBucket: "anandrealestate-703bc.firebasestorage.app",
  messagingSenderId: "306069028242",
  appId: "1:306069028242:web:1725c9497c32c2a76f954b",
  measurementId: "G-YGL2BXK1P0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;