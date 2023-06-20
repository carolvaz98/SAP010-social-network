import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getFirestore,
  increment,
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

/* // FUNÇÃO DE DAR O LIKE
export async function postLike(commentsId) {
  // eslint-disable-next-line no-console
  console.log('postLike called with commentsId:', commentsId);
  // getFirestone é chamada passando a instância do aplicativo app como argumento.
  // Ela retorna uma referência ao Firestore, que é armazenada na variável db
  const db = getFirestore(app);
  // doc é chamada passando referência para o FB(firebase) na (abaixo)
  // coleção 'comments' e o commentsId é passado como argumento
  const likeRef = doc(db, 'comments', commentsId);
  // a função updateDoc é chamada passando a referência do documento (likeRef)
  // e um objeto contendo a atualização desejada.
  await updateDoc(likeRef, {
    like: increment(1),
  });
} */