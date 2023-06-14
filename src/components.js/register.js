import { loginCreate, emailDuplicate } from '../lib/index.js';

export const validateName = (validName) => {
  const regexName = /^[a-zA-Z]{2,}$/;
  return regexName.test(validName);
};

export const validateEmail = (validEmail) => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(validEmail);
};

export const validatePassword = (validPassword) => {
  const regexPassword = /^.{6,}$/;
  return regexPassword.test(validPassword);
};

export const register = () => {
  const container = document.createElement('div');
  const registerHTML = `
    <div class="register-elements">
      <img src="../img/comunicacao.jpg" class="bg">
      <div class="containerRegister">
        <form id="formulario-cadastro">
          <img src="img/logo_petchat.png" class="logoPetRegister">
          <h1 class="register-h1"> Cadastro de usuário </h1>

          <div class="inputGroup">
            <label class="dados" for="nome">Nome:</label>
            <i class="material-icons inputIcon">person_outline</i>
            <input class="inputSignIn nome" type="text" id="nome" placeholder="Seu Nome" required>
          </div>

          <div id="error-container-name">
            <ul class="error-name"></ul>
          </div>

          <div class="inputGroup">
            <label class="dados" for="email">E-mail:</label>
            <i class="material-icons inputIcon">person_outline</i>
            <input class="inputSignIn email" type="email" id="email" placeholder="contato@exemplo.com" required>
          </div>

          <div id="error-container-email">
            <ul class="error-email"></ul>
          </div>

          <div class="inputGroup">
            <label class="dados" for="senha">Senha:</label>
            <i class="material-icons inputIcon">lock</i>
            <input class="inputSignIn senha" type="password" id="senha" placeholder="********" required>
          </div>

          <div id="error-container-password">
            <ul class="error-password"></ul>
          </div>

          <div class="inputGroup">
            <label class="dados" for="confirma-senha">Confirmar senha:</label>
            <i class="material-icons inputIcon">lock</i>
            <input class="inputSignIn confirmar-senha" type="password" id="confirma-senha" placeholder="********" required>
          </div>

          <div id="error-container-confirm">
            <ul class="error-confirm"></ul>
          </div>

          <button class="btn-reg" type="submit">Cadastrar</button>

          <button class="btn-return" type="button">Voltar</button>
        </form>
      </div>
    </div>
  `;
  container.innerHTML = registerHTML;

  // Seletores de erros
  const errorNameContainer = container.querySelector('.error-name');
  const errorEmailContainer = container.querySelector('.error-email');
  const errorPasswordContainer = container.querySelector('.error-password');
  const errorConfirmContainer = container.querySelector('.error-confirm');

  // Seletores de input
  const form = container.querySelector('#formulario-cadastro');
  const inputName = container.querySelector('.nome');
  const inputEmail = container.querySelector('.email');
  const inputPassword = container.querySelector('.senha');
  const inputConfirmPassword = container.querySelector('.confirmar-senha');
  const btnReturn = container.querySelector('.btn-return');

  btnReturn.addEventListener('click', () => {
    window.location.href = '';
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = inputEmail.value;
    const password = inputPassword.value;
    const confirm = inputConfirmPassword.value;
    const name = inputName.value;

    // Limpa os erros anteriores
    errorNameContainer.innerHTML = '';
    errorEmailContainer.innerHTML = '';
    errorPasswordContainer.innerHTML = '';
    errorConfirmContainer.innerHTML = '';

    // Lista as mensagens de erro
    const MessageErrorName = [];
    const MessageErrorEmail = [];
    const MessageErrorPassword = [];
    const MessageErrorConfirm = [];

    if (!validateEmail(email)) {
      MessageErrorEmail.push('E-mail inválido. Insira um endereço de e-mail válido.');
    }

    if (!validatePassword(password)) {
      MessageErrorPassword.push('Senha inválida. A senha deve conter pelo menos 6 caracteres.');
    }

    if (confirm !== password) {
      MessageErrorConfirm.push('As senhas não coincidem. Por favor, digite a mesma senha nos dois campos.');
    }

    if (!validateName(name)) {
      MessageErrorName.push('Nome inválido. O nome deve conter pelo menos 2 letras e apenas caracteres alfabéticos.');
    }

    if (MessageErrorEmail.length > 0) {
      MessageErrorEmail.forEach((error) => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorEmailContainer.appendChild(errorItem);
      });
    }

    if (MessageErrorPassword.length > 0) {
      MessageErrorPassword.forEach((error) => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorPasswordContainer.appendChild(errorItem);
      });
    }

    if (MessageErrorConfirm.length > 0) {
      MessageErrorConfirm.forEach((error) => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorConfirmContainer.appendChild(errorItem);
      });
    }

    if (MessageErrorName.length > 0) {
      MessageErrorName.forEach((error) => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorNameContainer.appendChild(errorItem);
      });
    } else {
      const emailExists = await emailDuplicate(email);

      if (emailExists) {
        const errorItem = document.createElement('li');
        errorItem.textContent = 'O e-mail já está cadastrado.';
        errorEmailContainer.appendChild(errorItem);
      } else {
        loginCreate(email, password, confirm);
        // eslint-disable-line no-alert
        // eslint-disable-next-line no-alert
        alert('Cadastro efetuado com sucesso!! Você será direcionado à página inicial para efetuar o login.');
        window.location.href = '';
      }
    }
  });
  return container;
};
