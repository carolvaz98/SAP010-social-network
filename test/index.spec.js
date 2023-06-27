import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getFirestore,
  getDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from 'firebase/firestore/lite';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  getAuth,
  signOut,
} from 'firebase/auth';

import { getUsers, app } from '../src/lib/firebase.js';

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

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  fetchSignInMethodsForEmail: jest.fn(),
  signInWithPopup: jest.fn(),
  updateProfile: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  getAuth: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore/lite', () => ({
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
}));

describe('Login Functions', () => {
  const mockAuth = { getAuth };
  const mockAuthInstance = getAuth();
  const mockUser = { displayName: 'Test' };

  beforeEach(() => {
    jest.clearAllMocks();
    createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    updateProfile.mockResolvedValue();
  });

  // TESTE - CRIAR USUÁRIO
  describe('loginCreate', () => {
    it('deve criar um usuário', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const name = 'Test';

      await loginCreate(email, password, name, mockAuth);

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuthInstance,
        email,
        password,
      );
      expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: name });
    });
  });

  // TESTE - ENTRAR COM USUÁRIO EXISTENTE
  describe('loginUser', () => {
    it('deve entrar com um usuário existente', async () => {
      const email = 'test@example.com';
      const password = 'password';

      await loginUser(email, password, mockAuth);

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuthInstance, email, password);
    });
  });

  // TESTE - VERIFICAR E-MAIL JÁ CADASTRADO
  describe('emailDuplicate', () => {
    it('deve verificar se já existe algum e-mail cadastrado', async () => {
      const email = 'test@example.com';
      const mockSignInMethods = ['password', 'emailLink'];

      fetchSignInMethodsForEmail.mockResolvedValue(mockSignInMethods);

      const result = await emailDuplicate(email);

      expect(fetchSignInMethodsForEmail).toHaveBeenCalledWith(mockAuthInstance, email);
      expect(result).toBe(true);
    });
  });

  // TESTE - ENTRAR COM LOGIN GOOGLE
  describe('loginGoogle', () => {
    it('deve fazer login com o provedor do Google', async () => {
      const mockGoogleAuthProvider = new GoogleAuthProvider();
      await loginGoogle(mockAuth);

      expect(signInWithPopup).toHaveBeenCalledWith(mockAuthInstance, mockGoogleAuthProvider);
    });
  });

  // TESTE - LOGOUT DE USUÁRIO
  describe('userStateLogout', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Deve fazer logout do usuário', async () => {
      await userStateLogout();

      expect(getAuth).toHaveBeenCalled();
      expect(signOut).toHaveBeenCalledWith(mockAuthInstance);
    });
  });

  // TESTE - ATUALIZAR / EDITAR UM COMENTÁRIO
  describe('updatePost', () => {
    test('Deve atualizar o comentário com sucesso', async () => {
      // mocks para as funções e objetos necessários
      const dbMock = {};
      const docMock = jest.fn();
      // comportamento esperado dos mocks
      getFirestore.mockReturnValue(dbMock);
      doc.mockReturnValue(docMock);
      updateDoc.mockImplementation(async (docRef, updatedData) => {
        // Simula a atualização do documento no Firestore
        docRef.data = updatedData;
      });
      // Chama a função que deseja testar
      const postId = 'postId';
      const updatedComment = { comment: 'Novo comentário' };
      await expect(updatePost(postId, updatedComment)).resolves.not.toThrow();
      // Verifica se as funções foram chamadas com os parâmetros corretos
      expect(getFirestore).toHaveBeenCalledTimes(1);
      expect(getFirestore).toHaveBeenCalledWith(app);
      expect(doc).toHaveBeenCalledTimes(1);
      expect(doc).toHaveBeenCalledWith(dbMock, 'comments', postId);
      expect(updateDoc).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledWith(docMock, updatedComment);
      // Verifica se o documento foi atualizado corretamente
      expect(docMock.data).toEqual(updatedComment);
    });
  });

  // TESTE - DELETAR UM COMENTÁRIO
  describe('deletePost', () => {
    test('deve excluir um post', async () => {
      const postId = 'abc123';
      // Chame a função deletePost e aguarde sua conclusão
      await deletePost(postId);
      // verificar se a função deleteDoc foi chamada com os argumentos corretos
      expect(deleteDoc).toHaveBeenCalledWith(doc(getFirestore(app), 'comments', postId));
    });
    test('deve imprimir uma mensagem de sucesso', async () => {
      const postId = 'abc123';
      const consoleLogMock = jest.spyOn(console, 'log'); // Cria um mock para a função console.log

      // Retorne uma Promise do teste
      return deletePost(postId).then(() => {
        // Verifique se a mensagem de sucesso foi impressa
        expect(consoleLogMock).toHaveBeenCalledWith('Comentário excluído com sucesso!');

        // Restaure a função original do console.log
        consoleLogMock.mockRestore();
      });
    });
  });

  // TESTE - CRIAR LISTA DE USUÁRIO NO FIREBASE
  describe('getUsers', () => {
    test('deve retornar a lista de usuários corretamente', async () => {
      // Crie um mock para a coleção de usuários
      const usersCol = 'mocked-collection';

      // Configure o mock da função collection para retornar o valor esperado
      collection.mockReturnValueOnce(usersCol);

      // Crie um mock para os dados dos usuários
      const user1 = { id: '1', name: 'Usuário 1' };
      const user2 = { id: '2', name: 'Usuário 2' };
      const userSnapshot = {
        docs: [
          { data: () => user1 },
          { data: () => user2 },
        ],
      };

      // Configure o mock da função getDocs para retornar o snapshot dos usuários
      getDocs.mockResolvedValueOnce(userSnapshot);

      // Chama a função getUsers passando o mock do Firestore
      const result = await getUsers('mocked-database');

      // Verifica se a função collection foi chamada corretamente
      expect(collection).toHaveBeenCalledWith('mocked-database', 'users');

      // Verifica se a função getDocs foi chamada corretamente
      expect(getDocs).toHaveBeenCalledWith(usersCol);

      // Verifica se a função getUsers retornou a lista de usuários corretamente
      expect(result).toEqual([user1, user2]);
    });
  });
});

// FUNÇÃO - DAR LIKE, DESLIKE E VERIFICAR SE EXISTE COMENTÁRIO VAZIO
jest.mock('firebase/firestore/lite');

describe('likePost', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve adicionar um like ao comentário', async () => {
    const commentId = 'comment123';
    const authUid = 'user123';

    const dbMock = getFirestore();
    const commentRefMock = doc(dbMock, 'comments', commentId);
    const commentDocMock = {
      exists: true,
      data: jest.fn().mockReturnValue({
        likeCount: 5,
        like: ['user1', 'user2'] || [],
      }),
    };

    getDoc.mockResolvedValue(commentDocMock);
    getAuth.mockReturnValue({ currentUser: { uid: authUid } });

    await likePost(commentId, true);

    expect(getFirestore).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(dbMock, 'comments', commentId);
    expect(getDoc).toHaveBeenCalledWith(commentRefMock);
    expect(updateDoc).toHaveBeenCalledWith(commentRefMock, {
      like: arrayUnion(authUid),
      likeCount: 6,
    });
  });

  test('deve remover um like do comentário', async () => {
    const commentId = 'comment123';
    const authUid = 'user123';

    const dbMock = getFirestore();
    const commentRefMock = doc(dbMock, 'comments', commentId);
    const commentDocMock = {
      exists: true,
      data: jest.fn().mockReturnValue({
        likeCount: 3,
        like: ['user1', 'user2', authUid],
      }),
    };

    getDoc.mockResolvedValue(commentDocMock);
    getAuth.mockReturnValue({ currentUser: { uid: authUid } });

    await likePost(commentId, false);

    expect(getFirestore).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(dbMock, 'comments', commentId);
    expect(getDoc).toHaveBeenCalledWith(commentRefMock);
    expect(updateDoc).toHaveBeenCalledWith(commentRefMock, {
      like: arrayRemove(authUid),
      likeCount: 2,
    });
  });

  test('não deve fazer nenhuma alteração se o comentário não existir', async () => {
    const commentId = 'comment123';

    const dbMock = getFirestore();
    const commentRefMock = doc(dbMock, 'comments', commentId);
    const commentDocMock = {
      exists: false,
    };

    getDoc.mockResolvedValue(commentDocMock);

    await likePost(commentId, true);

    expect(getFirestore).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(dbMock, 'comments', commentId);
    expect(getDoc).toHaveBeenCalledWith(commentRefMock);
    expect(updateDoc).not.toHaveBeenCalled();
  });
});
