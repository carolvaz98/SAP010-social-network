import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore/lite';

import { getUsers } from '../src/lib/firebase.js';

import {
  loginCreate,
  loginUser,
  loginGoogle,
  emailDuplicate,
  userStateLogout,
  updatePost,
  likePost,
  deletePost,
} from '../src/lib/index.js';

jest.mock('firebase/auth', () => {
  const authMock = {
    ...jest.requireActual('firebase/auth'),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    fetchSignInMethodsForEmail: jest.fn(),
    GoogleAuthProvider: jest.fn(),
    signInWithPopup: jest.fn(),
    updateProfile: jest.fn(),
    getAuth: jest.fn(),
    signOut: jest.fn(),
  };
  return authMock;
});

jest.mock('firebase/firestore/lite', () => {
  const firestoreMock = {
    ...jest.requireActual('firebase/firestore/lite'),
    collection: jest.fn(),
    getDocs: jest.fn(),
    updateDoc: jest.fn(),
    doc: jest.fn(),
    getFirestore: jest.fn(),
    getDoc: jest.fn(),
    arrayUnion: jest.fn(),
    arrayRemove: jest.fn(),
    deleteDoc: jest.fn(),
  };
  return firestoreMock;
});

describe('Login Functions', () => {
  const mockAuth = { getAuth: firebaseAuth.getAuth };
  const mockAuthInstance = firebaseAuth.getAuth();
  const mockUser = { displayName: 'Test' };

  // TESTE - CRIAR USUÁRIO
  describe('loginCreate', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      firebaseAuth.createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      firebaseAuth.updateProfile.mockResolvedValue();
    });

    test('deve criar um usuário', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const name = 'Test';
      await loginCreate(email, password, name, mockAuth);
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuthInstance,
        email,
        password,
      );
      expect(firebaseAuth.updateProfile).toHaveBeenCalledWith(mockUser, { displayName: name });
    });
  });

  // TESTE - LOGAR USUÁRIO
  describe('loginUser', () => {
    test('realiza login de usuário existente', async () => {
      const email = 'test@example.com';
      const password = 'password';
      await expect(loginUser(email, password)).resolves.toBeUndefined();
      // Verifica se a função loginUser é concluída sem nenhum erro.
    });
  });

  // TESTE - VERIFICAR E-MAIL DUPLICADO
  describe('emailDuplicate', () => {
    test('deve verificar se já existe algum e-mail cadastrado', async () => {
      const email = 'test@example.com';
      const mockSignInMethods = ['password', 'emailLink'];
      firebaseAuth.fetchSignInMethodsForEmail.mockResolvedValue(mockSignInMethods);
      const result = await emailDuplicate(email);
      expect(firebaseAuth.fetchSignInMethodsForEmail).toHaveBeenCalledWith(mockAuthInstance, email);
      expect(result).toBe(true);
    });
  });

  // TESTE - LOGAR COM O GOOGLE
  describe('loginGoogle', () => {
    test('deve fazer login com o provedor do Google', async () => {
      const mockGoogleAuthProvider = new firebaseAuth.GoogleAuthProvider();
      await loginGoogle(mockAuth);
      expect(firebaseAuth.signInWithPopup).toHaveBeenCalledWith(
        mockAuthInstance,
        mockGoogleAuthProvider,
      );
    });
  });

  // TESTE - DESLOGAR O USUÁRIO
  describe('userStateLogout', () => {
    test('Deve fazer logout do usuário', async () => {
      await userStateLogout();
      expect(firebaseAuth.getAuth).toHaveBeenCalled();
      expect(firebaseAuth.signOut).toHaveBeenCalledTimes(1);
    });
  });

  // TESTE - ATUALIZAR / EDITAR UM POST
  describe('updatePost', () => {
    test('atualiza um post corretamente', async () => {
      const updatedComment = {};
      await expect(updatePost('postId', updatedComment)).resolves.toBeUndefined();
    });
  });

  // TESTE - DELETAR UM POST
  describe('deletePost', () => {
    test('deve excluir um post', async () => {
      const postId = 'abc123';
      await deletePost(postId);
      expect(firebaseFirestore.deleteDoc).toHaveBeenCalledTimes(1);
    });
  });
});

// TESTE - RETORNAR LISTA DE USUÁRIOS - FIREBASE
describe('getUsers', () => {
  test('deve retornar a lista de usuários corretamente', async () => {
    const usersCol = 'mocked-collection';

    firebaseFirestore.collection.mockReturnValueOnce(usersCol);

    const user1 = { id: '1', name: 'Usuário 1' };
    const user2 = { id: '2', name: 'Usuário 2' };
    const userSnapshot = {
      docs: [
        { data: () => user1 },
        { data: () => user2 },
      ],
    };
    firebaseFirestore.getDocs.mockResolvedValueOnce(userSnapshot);
    const result = await getUsers('mocked-database');
    expect(firebaseFirestore.collection).toHaveBeenCalledWith('mocked-database', 'users');
    expect(firebaseFirestore.getDocs).toHaveBeenCalledWith(usersCol);
    expect(result).toEqual([user1, user2]);
  });
});

// TESTE - DAR LIKE E DESLIKE EM POSTS
describe('likePost', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('deve adicionar um like ao comentário', async () => {
    const commentId = 'comment123';
    const authUid = 'user123';

    const dbMock = firebaseFirestore.getFirestore();
    const commentRefMock = firebaseFirestore.doc(dbMock, 'comments', commentId);
    const commentDocMock = {
      exists: true,
      data: jest.fn().mockReturnValue({
        likeCount: 5,
        like: ['user1', 'user2'] || [],
      }),
    };
    firebaseFirestore.getDoc.mockResolvedValue(commentDocMock);
    firebaseAuth.getAuth.mockReturnValue({ currentUser: { uid: authUid } });

    await likePost(commentId, true);

    expect(firebaseFirestore.getFirestore).toHaveBeenCalled();
    expect(firebaseFirestore.doc).toHaveBeenCalledWith(dbMock, 'comments', commentId);
    expect(firebaseFirestore.getDoc).toHaveBeenCalledWith(commentRefMock);
    expect(firebaseFirestore.updateDoc).toHaveBeenCalledWith(commentRefMock, {
      like: firebaseFirestore.arrayUnion(authUid),
      likeCount: 6,
    });
  });

  test('deve remover um like do comentário', async () => {
    const commentId = 'comment123';
    const authUid = 'user123';

    const dbMock = firebaseFirestore.getFirestore();
    const commentRefMock = firebaseFirestore.doc(dbMock, 'comments', commentId);
    const commentDocMock = {
      exists: true,
      data: jest.fn().mockReturnValue({
        likeCount: 3,
        like: ['user1', 'user2', authUid],
      }),
    };
    firebaseFirestore.getDoc.mockResolvedValue(commentDocMock);
    firebaseAuth.getAuth.mockReturnValue({ currentUser: { uid: authUid } });

    await likePost(commentId, false);

    expect(firebaseFirestore.getFirestore).toHaveBeenCalled();
    expect(firebaseFirestore.doc).toHaveBeenCalledWith(dbMock, 'comments', commentId);
    expect(firebaseFirestore.getDoc).toHaveBeenCalledWith(commentRefMock);
    expect(firebaseFirestore.updateDoc).toHaveBeenCalledWith(commentRefMock, {
      like: firebaseFirestore.arrayRemove(authUid),
      likeCount: 2,
    });
  });
});
