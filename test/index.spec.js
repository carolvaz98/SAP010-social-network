// importamos la funcion que vamos a testear
import {
  createUserWithEmailAndPassword,
  updateProfile,
  auth,
  user,
} from 'firebase/auth';
import { validatePassword, validateEmail, validateName } from '../src/components.js/register.js';
import { loginCreate } from '../src/lib/index.js';


describe('Validações de e-mail e senha', () => {
  // validação de e-mail
  describe('validateEmail', () => {
    test('Deve retornar true para um e-mail válido', () => {
      const validEmail = 'test@example.com';
      expect(validateEmail(validEmail)).toBe(true);
    });

    test('Deve retornar false para um e-mail inválido', () => {
      const invalidEmail = 'invalid_email';
      expect(validateEmail(invalidEmail)).toBe(false);
    });
  });

  // validação de senha
  describe('validatePassword', () => {
    test('Deve retornar true para uma senha válida', () => {
      const validPassword = 'senha123';
      expect(validatePassword(validPassword)).toBe(true);
    });

    test('Deve retornar false para uma senha inválida', () => {
      const invalidPassword = 'senha';
      expect(validatePassword(invalidPassword)).toBe(false);
    });
  });
});

describe('validateName', () => {
  test('Deve retornar true para um nome válido', () => {
    const result = validateName('Maria');
    expect(result).toBe(true);
  });

  test('Deve retornar false para um nome inválido', () => {
    const result = validateName('123');
    expect(result).toBe(false);
  });
});

describe('loginCreate', () => {
  test('Deve criar um usuário', async (done) => {
    const mockEmail = 'test@example.com';
    const mockPassword = '123456';
    const mockName = 'User name';

    try {
      await loginCreate(mockEmail, mockPassword, mockName);

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, mockEmail, mockPassword);
      expect(updateProfile).toHaveBeenCalledWith(user, { displayName: mockName });

      done();
    } catch (error) {
      done(error);
    }
  });
});
