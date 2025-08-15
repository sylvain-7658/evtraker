// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Firebase configuration is loaded from environment variables.
// These variables must be set in the execution environment.
// ATTENTION : Assurez-vous que l'authentification par e-mail/mot de passe est activée dans votre projet Firebase.
// NOTE: Si les variables d'environnement ne sont pas définies, des valeurs de remplacement
// sont utilisées pour permettre à l'application de s'initialiser sans planter.
// Vous DEVEZ remplacer ces valeurs par votre configuration réelle ou définir les variables d'environnement pour que Firebase fonctionne.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSy...",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "votre-projet.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "votre-id-projet",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "votre-projet.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.FIREBASE_APP_ID || "1:123456789012:web:123456abcdef"
};

let auth: firebase.auth.Auth;
let db: firebase.firestore.Firestore;
let isFirebaseConfigured = false;

// Check if the configuration has been updated from the placeholder values.
if (firebaseConfig.projectId && firebaseConfig.projectId !== "votre-id-projet") {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  auth = firebase.auth();
  db = firebase.firestore();
  isFirebaseConfigured = true;
} else {
  // Firebase is not configured. Assign mock objects to prevent crashes on import.
  // The application's UI will inform the user that authentication and data persistence are unavailable.
  auth = {} as any;
  db = {} as any;
}

export { auth, db, isFirebaseConfigured };


// IMPORTANT pour l'administrateur :
// Pour définir un utilisateur comme administrateur, vous devez le faire manuellement dans votre base de données Firestore.
// 1. Laissez l'utilisateur se connecter une fois pour créer son document.
// 2. Allez dans votre console Firebase -> Firestore Database.
// 3. Trouvez la collection `users` et le document correspondant à l'e-mail de l'administrateur.
// 4. Ajoutez un champ booléen `isAdmin` et mettez sa valeur à `true`.