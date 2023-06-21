import { collection, getDocs } from 'firebase/firestore/lite';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
  getAuth,
} from 'firebase/auth';

import { getUsers } from '../src/lib/firebase.js';

import {
  loginCreate,
  loginUser,
  loginGoogle,
  loginGithub,
  emailDuplicate,
} from '../src/lib/index.js';

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  fetchSignInMethodsForEmail: jest.fn(),
  signInWithPopup: jest.fn(),
  updateProfile: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  GithubAuthProvider: jest.fn(),
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

    it('deve gerar um erro quando a criação do usuário falhar', async () => {
      const mockError = new Error('Ocorreu um erro ao criar o usuário, tente novamente.');
      createUserWithEmailAndPassword.mockRejectedValue(mockError);

      await expect(loginCreate('', '', '')).rejects.toThrow('Ocorreu um erro ao criar o usuário, tente novamente.');
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

    it('deve gerar um erro quando o login falha', async () => {
      const mockError = new Error('Ocorreu um erro. E-mail ou senha não correspondem com o cadastro, tente novamente.');
      signInWithEmailAndPassword.mockRejectedValue(mockError);

      await expect(loginUser('', '')).rejects.toThrow('Ocorreu um erro. E-mail ou senha não correspondem com o cadastro, tente novamente.');
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

    it('deve gerar um erro quando ocorrer um erro ao verificar o e-mail cadastrado', async () => {
      const email = 'test@example.com';
      const mockError = new Error('Ocorreu um erro ao verificar o e-mail cadastrado.');

      fetchSignInMethodsForEmail.mockRejectedValue(mockError);

      await expect(emailDuplicate(email)).rejects.toThrow('Ocorreu um erro ao verificar o e-mail cadastrado.');
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

  // TESTE - ENTRAR COM LOGIN GITHUB
  describe('loginGithub', () => {
    it('deve fazer login com o provedor do Github', async () => {
      const mockGithubAuthProvider = new GithubAuthProvider();
      await loginGithub(mockAuth);

      expect(signInWithPopup).toHaveBeenCalledWith(mockAuthInstance, mockGithubAuthProvider);
    });
  });
});

// Crie um mock para o Firestore
jest.mock('firebase/firestore/lite');

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
