import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  AuthCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import * as authService from './authService';
import { saveToken, saveUser, removeToken, removeUser } from './storageService';

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * Registrar usuario con Firebase y Backend
 */
export const registerWithFirebase = async (
  nombre: string,
  email: string,
  password: string
): Promise<{ user: FirebaseUser; backendUser: any }> => {
  try {
    // 1. Crear usuario en Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 2. Actualizar perfil en Firebase
    await updateProfile(firebaseUser, {
      displayName: nombre,
    });

    // 3. Guardar datos adicionales en Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      uid: firebaseUser.uid,
      email: email,
      nombre: nombre,
      displayName: nombre,
      photoURL: firebaseUser.photoURL || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      provider: 'email',
    });

    // 4. Registrar en el backend
    const backendUser = await authService.register(nombre, email, password);

    // 5. Hacer login en el backend para obtener el token
    const loginResponse = await authService.login(email, password);

    return {
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
      },
      backendUser: loginResponse.user,
    };
  } catch (error: any) {
    console.error('Error en registro con Firebase:', error);
    throw new Error(error.message || 'Error al registrar usuario');
  }
};

/**
 * Login con Firebase y Backend
 */
export const loginWithFirebase = async (
  email: string,
  password: string
): Promise<{ user: FirebaseUser; backendUser: any; token: string }> => {
  try {
    // 1. Autenticar con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 2. Autenticar con el backend
    const backendResponse = await authService.login(email, password);

    // 3. Actualizar última conexión en Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await updateDoc(userDocRef, {
      lastLogin: new Date().toISOString(),
    });

    return {
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
      },
      backendUser: backendResponse.user,
      token: backendResponse.token,
    };
  } catch (error: any) {
    console.error('Error en login con Firebase:', error);
    throw new Error(error.message || 'Error al iniciar sesión');
  }
};

/**
 * Login con Google (solo web por ahora)
 */
export const loginWithGoogle = async (): Promise<{
  user: FirebaseUser;
  backendUser: any;
  token: string;
}> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Obtener el token de ID de Firebase
    const idToken = await firebaseUser.getIdToken();

    // TODO: Enviar el token al backend para autenticación
    // Por ahora, intentamos login con email (si existe en backend)
    const email = firebaseUser.email || '';
    
    // Verificar/crear usuario en Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Crear documento de usuario en Firestore
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        nombre: firebaseUser.displayName,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: 'google',
        lastLogin: new Date().toISOString(),
      });
    } else {
      // Actualizar última conexión
      await updateDoc(userDocRef, {
        lastLogin: new Date().toISOString(),
      });
    }

    // TODO: Implementar endpoint de backend para Google OAuth
    // Por ahora, retornamos los datos de Firebase
    return {
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
      },
      backendUser: {
        id_usuario: parseInt(firebaseUser.uid.substring(0, 8), 36),
        email: firebaseUser.email,
        nombre: firebaseUser.displayName,
      },
      token: idToken,
    };
  } catch (error: any) {
    console.error('Error en login con Google:', error);
    throw new Error(error.message || 'Error al iniciar sesión con Google');
  }
};

/**
 * Cerrar sesión en Firebase y Backend
 */
export const logoutFromFirebase = async (): Promise<void> => {
  try {
    // 1. Cerrar sesión en Firebase
    await signOut(auth);

    // 2. Limpiar datos del backend
    await authService.logout();
  } catch (error: any) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

/**
 * Recuperar contraseña
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error al enviar email de recuperación:', error);
    throw new Error(error.message || 'Error al enviar email de recuperación');
  }
};

/**
 * Obtener el usuario actual de Firebase
 */
export const getCurrentFirebaseUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Observador de cambios en el estado de autenticación
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Obtener datos adicionales del usuario desde Firestore
 */
export const getUserData = async (uid: string): Promise<any> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
};

export const firebaseAuthService = {
  registerWithFirebase,
  loginWithFirebase,
  loginWithGoogle,
  logoutFromFirebase,
  resetPassword,
  getCurrentFirebaseUser,
  onAuthStateChange,
  getUserData,
};
