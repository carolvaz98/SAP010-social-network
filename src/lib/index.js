import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';

/* import { getUsers, collection, getDocs } from 'firebase/firestore'; */

import { auth } from './firebase.js';

// CRIAR USUÁRIO
export const loginCreate = async (email, password, name) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    // O nome do usuário foi atualizado no perfil do usuário
  } catch (error) {
    throw new Error('Ocorreu um erro ao criar o usuário.');
  }
};

// LOGAR COM USUÁRIO EXISTENTE
export const loginUser = (email, password) => {
  signInWithEmailAndPassword(auth, email, password);
};

// LOGAR COM CONTA GOOGLE
export const loginGoogle = () => {
  const authInstance = getAuth();
  const provider = new GoogleAuthProvider();

  return signInWithPopup(authInstance, provider);
};

export const loginGithub = () => {
  const authInstance = getAuth();
  const provider = new GithubAuthProvider();

  return signInWithPopup(authInstance, provider);
};
