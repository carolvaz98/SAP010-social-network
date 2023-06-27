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
export async function loginCreate(email, password, name) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
}

// LOGAR COM USUÁRIO EXISTENTE
export async function loginUser(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function emailDuplicate(email) {
  const signInMethods = await fetchSignInMethodsForEmail(auth, email);
  return signInMethods.length > 0;
}

// LOGAR COM CONTA GOOGLE
export async function loginGoogle() {
  const authInstance = getAuth();
  const provider = new GoogleAuthProvider();
  return signInWithPopup(authInstance, provider);
}

// FUNÇÃO PARA USUÁRIO SAIR DO SITE
export async function userStateLogout() {
  const authLogOut = getAuth();
  await signOut(authLogOut);
  console.log('Usuário deslogado com sucesso.');
}

// MANTER USUÁRIO LOGADO (https://firebase.google.com/docs/auth/web/manage-users?hl=pt-br)

export async function userAuthChanged(callback) {
  const authLogin = getAuth(app);
  onAuthStateChanged(authLogin, callback);
}

// FUNÇÃO PARA ADICIONAR COMENTARIO NO BANCO DE DADOS
export async function addPost(db, comments) {
  const commentsColl = collection(db, 'comments');
  await addDoc(commentsColl, comments);
  // eslint-disable-next-line no-console
  console.log('Comentário adicionado com sucesso.');
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
  // eslint-disable-next-line no-console
  console.log('Comentário excluído com sucesso!');
}

// EDITAR UM POST
export async function updatePost(postId, updatedComment) {
  const db = getFirestore(app);
  await updateDoc(doc(db, 'comments', postId), updatedComment);
  // eslint-disable-next-line no-console
  console.log('Comentário atualizado com sucesso!');
}

// FUNÇÃO DE DAR O LIKE
export async function likePost(commentId, like) {
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
}
