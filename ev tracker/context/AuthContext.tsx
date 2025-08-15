import React, { createContext, useContext, useState, useEffect, FC, PropsWithChildren } from 'react';
import { User } from '../types';
import { auth, db, isFirebaseConfigured } from '../firebase/config';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: firebase.User | null) => {
      if (firebaseUser) {
        // User is signed in, get their profile from Firestore
        const userDocRef = db.collection('users').doc(firebaseUser.uid);
        const docSnap = await userDocRef.get();
        
        if (docSnap.exists) {
          const userData = docSnap.data();
          setCurrentUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            isAdmin: userData?.isAdmin || false,
          });
        } else {
          // This case can happen if the Firestore doc creation failed after registration
          // We create it here to be safe. A new user is never an admin.
          await db.collection('users').doc(firebaseUser.uid).set({ email: firebaseUser.email, isAdmin: false });
           setCurrentUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            isAdmin: false,
          });
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string): Promise<void> => {
    if (!isFirebaseConfigured) {
        throw new Error("La configuration de Firebase est invalide. Impossible de créer un compte.");
    }
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const newUser = userCredential.user;
    if (!newUser) {
      throw new Error("User creation failed.");
    }
    
    // Create a document for the new user in the 'users' collection
    await db.collection("users").doc(newUser.uid).set({
      email: newUser.email,
      isAdmin: false
    });
  };

  const login = async (email: string, password: string): Promise<void> => {
    if (!isFirebaseConfigured) {
        throw new Error("La configuration de Firebase est invalide. Impossible de se connecter.");
    }
    await auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    if (isFirebaseConfigured) {
        auth.signOut();
    }
  };

  const value = { currentUser, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};