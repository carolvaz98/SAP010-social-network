import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getFirestore,
  increment,
  // FieldValue,
} from 'firebase/firestore/lite';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  fetchSignInMethodsForEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import { auth, app } from './firebase.js';

// CRIAR USUÁRIO
export const loginCreate = async (email, password, name) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
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
export const loginGoogle = () => {
  const authInstance = getAuth();
  const provider = new GoogleAuthProvider();
  return signInWithPopup(authInstance, provider);
};

// LOGAR COM CONTA GITHUB
export const loginGithub = () => {
  const authInstance = getAuth();
  const provider = new GithubAuthProvider();
  return signInWithPopup(authInstance, provider);
};

// FUNÇÃO PARA USUÁRIO SAIR DO SITE (??? try/catch)
export function userStateLogout() {
  const authLogOut = getAuth();
  signOut(authLogOut);
}

// MANTER USUÁRIO LOGADO (https://firebase.google.com/docs/auth/web/manage-users?hl=pt-br)

export function userAuthChanged(callback) {
  try {
    const authLogin = getAuth(app);
    onAuthStateChanged(authLogin, callback);
  } catch (error) {
    // eslint-disable-next-line
    console.log('Erro ao verificar o estado de autenticação:', err);
  }
}

// FUNÇÃO PARA ADICIONAR COMENTARIO NO BANCO DE DADOS
// comments é como está salvo no firabase, onde será adicionado os comentarios
export async function addPost(db, comments) {
  const commentsColl = collection(db, 'comments');
  await addDoc(commentsColl, comments);
}

// RECUPERA TODOS OS COMENTÁRIOS DO DB, MAPEIA E TRAZ TODOS EM LISTA PARA O SITE
export async function getPosts(db) {
  const commColl = collection(db, 'comments');
  const postsSnapshot = await getDocs(commColl);
  // eslint-disable-next-line no-shadow
  const commList = postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return commList;
}

// DELETAR UM POST
export async function deletePost(postId) {
  const db = getFirestore(app);
  await deleteDoc(doc(db, 'comments', postId));
  console.log('Comentário excluído com sucesso!');
}

// EDITAR UM POST
export async function updatePost(postId, updatedComment) {
  const db = getFirestore(app);
  await updateDoc(doc(db, 'comments', postId), updatedComment);
  console.log('Comentário atualizado com sucesso!');
}

// FUNÇÃO DE DAR O LIKE
export async function likePost(postId) {
  const db = getFirestore(app);
  const docRef = doc(db, 'comments', postId);
  await updateDoc(docRef, {
    like: increment(1),
  });
}





/* FUNÇÃO PARA BUSCAR OD DADOS DOS LIKES
export async function getLikeData(postId) {
  const db = getFirestore(app);
  const docRef = doc(db, 'comments', postId);
  const docSnapshot = await getDocs(docRef);
  const commentData = docSnapshot.data();

  const userLiked = commentData.like && commentData.like[auth.currentUser.uid] === 1;
  const likeCount = commentData.likeCount || 0;

  return {
    userLiked,
    likeCount,
  };
} */
