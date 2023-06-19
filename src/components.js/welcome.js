import { loginUser, loginGoogle, loginGithub } from '../lib/index.js';

export const welcome = () => {
  const container = document.createElement('div');

  const signInHTML = `
    // Código HTML omitido para brevidade
  `;

  container.innerHTML = signInHTML;

  const errorEmailPassword = container.querySelector('.error-email-password');
  const errorGoogleGithub = container.querySelector('.error-Google-Github');
  const inputEmail = container.querySelector('.inputSignIn[type="email"]');
  const inputPass = container.querySelector('.inputSignIn[type="password"]');
  const btnSignIn = container.querySelector('.btnSignIn');
  const btnRegister = container.querySelector('.btnRegister');
  const btnGoogle = container.querySelector('.btnGoogle');
  const btnGitHub = container.querySelector('.btnGitHub');

  btnSignIn.addEventListener('click', async (event) => {
    event.preventDefault();

    const email = inputEmail.value;
    const password = inputPass.value;

    errorEmailPassword.innerHTML = '';
    errorGoogleGithub.innerHTML = '';

    try {
      await loginUser(email, password);
      window.location.hash = '#feed';
    } catch (error) {
      const errorItem = document.createElement('li');
      errorItem.textContent = error.message;
      errorEmailPassword.appendChild(errorItem);
    }
  });

  btnRegister.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.hash = '#register';
  });

  btnGoogle.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
      await loginGoogle();
      window.location.hash = '#feed';
    } catch (error) {
      const errorItem = document.createElement('li');
      errorItem.textContent = error.message;
      errorGoogleGithub.appendChild(errorItem);
    }
  });

  btnGitHub.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
      await loginGithub();
      window.location.hash = '#feed';
    } catch (error) {
      const errorItem = document.createElement('li');
      errorItem.textContent = error.message;
      errorGoogleGithub.appendChild(errorItem);
    }
  });

  return container;
};
