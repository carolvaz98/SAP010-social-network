import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getFirestore,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore/lite';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
export async function loginGoogle() {
  try {
    const authInstance = getAuth();
    const provider = new GoogleAuthProvider();
    return signInWithPopup(authInstance, provider);
  } catch (error) {
    throw new Error('Ocorreu um erro ao realizar o logon Google, tente novamente.');
  }
}

// FUNÇÃO PARA USUÁRIO SAIR DO SITE
export async function userStateLogout() {
  try {
    const authLogOut = getAuth();
    await signOut(authLogOut);
    console.log('Usuário deslogado com sucesso.');
  } catch (error) {
    throw new Error('Ocorreu um erro ao deslogar o usuário');
  }
}

// MANTER USUÁRIO LOGADO (https://firebase.google.com/docs/auth/web/manage-users?hl=pt-br)

export async function userAuthChanged(callback) {
  try {
    const authLogin = getAuth(app);
    onAuthStateChanged(authLogin, callback);
  } catch (error) {
    console.log('Erro ao verificar o estado de autenticação.');
  }
}

// FUNÇÃO PARA ADICIONAR COMENTARIO NO BANCO DE DADOS
// comments é como está salvo no firabase, onde será adicionado os comentarios
export async function addPost(db, comments) {
  try {
    const commentsColl = collection(db, 'comments');
    await addDoc(commentsColl, comments);
    console.log('Comentário adicionado com sucesso.');
  } catch (error) {
    throw new Error('Ocorreu um erro ao adicionar o comentário');
  }
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
export const likePost = async (commentId, like) => {
  const db = getFirestore();
  const commentRef = doc(db, 'comments', commentId);
  const commentDoc = await getDoc(commentRef);

  if (commentDoc.exists) {
    const authUid = getAuth().currentUser.uid;
    const commentData = commentDoc.data();

    const likeCount = commentData.likeCount || 0;

    if (like && (!commentData.like || !commentData.like.includes(authUid))) {
      await updateDoc(commentRef, {
        like: arrayUnion(authUid),
        likeCount: likeCount + 1,
      });
    }

    if (!like && commentData.like && commentData.like.includes(authUid)) {
      await updateDoc(commentRef, {
        like: arrayRemove(authUid),
        likeCount: likeCount - 1,
      });
    }
  }
};
