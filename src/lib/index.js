import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';

import { auth } from './firebase.js';

// CRIAR USUÁRIO
export const loginCreate = async (email, password, name) => {
  try {
    const authInstance = getAuth(auth);
    const { user } = await createUserWithEmailAndPassword(authInstance, email, password);
    await updateProfile(user, { displayName: name });
    // O nome do usuário foi atualizado no perfil do usuário
  } catch (error) {
    throw new Error('Ocorreu um erro ao criar o usuário, tente novamente.');
  }
};

// LOGAR COM USUÁRIO EXISTENTE
export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error('Ocorreu um erro. E-mail ou senha não correspondem com o cadastro, tente novamente.');
  }
};

export const emailDuplicate = async (email) => {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return signInMethods.length > 0;
  } catch (error) {
    throw new Error('Ocorreu um erro ao verificar o e-mail cadastrado.');
  }
};

// LOGAR COM CONTA GOOGLE
export const loginGoogle = async () => {
  try {
    const authInstance = getAuth();
    const provider = new GoogleAuthProvider();
    return signInWithPopup(authInstance, provider);
  } catch (error) {
    throw new Error('Ocorreu um erro ao utilizar o login Google, tente novamente.');
  }
};

// LOGAR COM CONTA GITHUB
export const loginGithub = async () => {
  try {
    const authInstance = getAuth();
    const provider = new GithubAuthProvider();
    return signInWithPopup(authInstance, provider);
  } catch (error) {
    throw new Error('Ocorreu um erro ao utilizar o login GitHub, tente novamente.');
  }
};
