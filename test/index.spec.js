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

  // TESTE CRIAR USUÁRIO
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

  // TESTE ENTRAR COM USUÁRIO EXISTENTE
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

  // TESTE VERIFICAR E-MAIL JÁ CADASTRADO
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

  // TESTE ENTRAR COM LOGIN GOOGLE
  describe('loginGoogle', () => {
    it('deve fazer login com o provedor do Google', async () => {
      const mockGoogleAuthProvider = new GoogleAuthProvider();
      await loginGoogle(mockAuth);

      expect(signInWithPopup).toHaveBeenCalledWith(mockAuthInstance, mockGoogleAuthProvider);
    });

    it('deve gerar um erro ao logar com o Google', async () => {
      const mockError = new Error('Ocorreu um erro ao utilizar o login Google, tente novamente.');

      signInWithPopup.mockRejectedValue(mockError);

      await expect(loginGoogle()).rejects.toThrow('Ocorreu um erro ao utilizar o login Google, tente novamente.');
    });
  });

  // TESTE ENTRAR COM LOGIN GITHUB
  describe('loginGithub', () => {
    it('deve fazer login com o provedor do Github', async () => {
      const mockGithubAuthProvider = new GithubAuthProvider();
      await loginGithub(mockAuth);

      expect(signInWithPopup).toHaveBeenCalledWith(mockAuthInstance, mockGithubAuthProvider);
    });

    it('deve gerar um erro ao logar com o Github', async () => {
      const mockError = new Error('Ocorreu um erro ao utilizar o login Github, tente novamente.');

      signInWithPopup.mockRejectedValue(mockError);

      await expect(loginGithub()).rejects.toThrow('Ocorreu um erro ao utilizar o login Github, tente novamente.');
    });
  });
});
