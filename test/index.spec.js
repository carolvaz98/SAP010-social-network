import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
  updateProfile,
  getAuth,
} from 'firebase/auth';

import {
  loginCreate,
  loginUser,
  loginGoogle,
  loginGithub,
} from '../src/lib/index.js';

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  updateProfile: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  GithubAuthProvider: jest.fn(),
}));

describe('Login Functions', () => {
  const mockAuth = { getAuth };
  const mockUser = { displayName: 'Test User' };

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
      const name = 'Test User';

      await loginCreate(email, password, name);

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, email, password);
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

      await loginUser(email, password);

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, email, password);
    });

    it('deve gerar um erro quando o login falha', async () => {
      const mockError = new Error('Ocorreu um erro. E-mail ou senha não correspondem com o cadastro, tente novamente.');
      signInWithEmailAndPassword.mockRejectedValue(mockError);

      await expect(loginUser('', '')).rejects.toThrow('Ocorreu um erro ao fazer login, verifique suas credenciais.');
    });
  });

  // TESTE ENTRAR COM LOGIN GOOGLE
  describe('loginGoogle', () => {
    const mockGoogleAuthProvider = { GoogleAuthProvider };

    it('deve fazer login com o provedor do Google', async () => {
      await loginGoogle();

      expect(signInWithPopup).toHaveBeenCalledWith(mockAuth, mockGoogleAuthProvider);
    });
  });

  // TESTE ENTRAR COM LOGIN GITHUB
  describe('loginGithub', () => {
    const mockGithubAuthProvider = { GithubAuthProvider };

    it('deve fazer login com o provedor do GitHub', async () => {
      await loginGithub();

      expect(signInWithPopup).toHaveBeenCalledWith(mockAuth, mockGithubAuthProvider);
    });
  });
});
