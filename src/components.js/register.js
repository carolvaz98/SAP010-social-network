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
        <div class="mainPage">
            <form id="formulario-cadastro">
                <img src="img/logo_petchat.png" class="logoW">
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

                      <div id="error-container-email-duplicate">
                        <ul class="error-email-duplicate"></ul>
                      </div>
   
                      <div class="inputGroup">
                        <label class="dados" for="senha">Senha:</label>
                        <i class="material-icons inputIcon">lock</i>
                        <input class="inputSignIn senha" type="password" id="senha" placeholder="********" required>
                      </div>

                      <div id="error-container-email-password">
                        <ul class="error-email-password"></ul>
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

                      <button class="btn-return" type="submit">Voltar</button>
              </form>
          </div>
      </div> 
  `;
  container.innerHTML = registerHTML;
  // SELETORES DE ERROS
  const errorNameContainer = container.querySelector('.error-name');
  const errorEmailPasswordContainer = container.querySelector('.error-email-password');
  const errorConfirmContainer = container.querySelector('.error-confirm');
  const errorDuplicate = container.querySelector('.error-email-duplicate');
  // SELETORES DE INPUT
  const inputName = container.querySelector('.nome');
  const inputEmail = container.querySelector('.email');
  const inputPassword = container.querySelector('.senha');
  const inputConfirm = container.querySelector('.confirmar-senha');
  const btnReturn = container.querySelector('.btn-return');
  const form = container.querySelector('#formulario-cadastro');

  btnReturn.addEventListener('click', () => {
    window.location.hash = '';
  });

  const validateForm = (name, email, password, confirm) => {
    const errors = {
      name: [],
      emailPassword: [],
      confirm: [],
      errorDuplicate: [],
    };

    if (!validateEmail(email) || !validatePassword(password)) {
      errors.emailPassword.push('Por favor, insira uma senha com no mínimo 6 caracteres e um e-mail válido.');
    }

    if (confirm !== password) {
      errors.confirm.push('As senhas estão diferentes. Por favor, preencha os campos de senha igualmente.');
    }

    if (!validateName(name)) {
      errors.name.push('O campo nome não pode conter caracteres especiais.');
    }

    if (!emailDuplicate(email)) {
      errors.errorDuplicate.push('Email já cadastrado. Por favor, utilize outro email.');
    }

    return errors;
  };

  const displayErrors = (errorContainer, errorMessages) => {
    errorContainer.innerHTML = ''; // Limpa os erros anteriores

    errorMessages.forEach((errorMessage) => {
      const errorItem = document.createElement('li');
      errorItem.textContent = errorMessage;
      errorContainer.appendChild(errorItem);
    });
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = inputEmail.value;
    const password = inputPassword.value;
    const confirm = inputConfirm.value;
    const name = inputName.value;

    const errors = validateForm(name, email, password, confirm);

    displayErrors(errorNameContainer, errors.name);
    displayErrors(errorEmailPasswordContainer, errors.emailPassword);
    displayErrors(errorConfirmContainer, errors.confirm);
    displayErrors(errorDuplicate, errors.errorDuplicate);

    if (
      errors.name.length === 0 && errors.emailPassword.length === 0 && errors.confirm.length === 0
      && errors.errorDuplicate.length === 0
    ) {
      loginCreate(email, password, confirm);
      alert('Cadastro efetuado com sucesso!! Você será direcionado à página inicial para efetuar o login.'); // eslint-disable-line no-alert
      window.location.href = '';
    }
  });

  return container;
};

export default register;

/* form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = inputEmail.value;
  const password = inputPassword.value;
  const confirm = inputConfirm.value;
  const name = inputName.value;

  errorNameContainer.innerHTML = ''; // Limpa os erros anteriores
  errorEmailPasswordContainer.innerHTML = ''; // Limpa os erros anteriores
  errorConfirmContainer.innerHTML = ''; // Limpa os erros anteriores

  const errorsName = []; // Lista de erros de nome
  const errorsEmailPassword = []; // Lista de erros de e-mail/senha
  const errorsConfirm = []; // Lista de erros de confirmação de senha

  if (!validateEmail(email) || !validatePassword(password)) {
    errorsEmailPassword.push(
      'Por favor, insira uma senha com no mínimo 6 caracteres e um e-mail válido.
    ');
  }

  if (confirm !== password) {
    errorsConfirm.push(
      'As senhas estão diferentes. Por favor, preencha os campos de senha igualmente.'
    );
  }

  if (!validateName(name)) {
    errorsName.push('O campo nome não pode conter caracteres especiais.');
  }

  if (errorsEmailPassword.length > 0) {
    errorsEmailPassword.forEach((error) => {
      const errorItem = document.createElement('li');
      errorItem.textContent = error;
      errorEmailPasswordContainer.appendChild(errorItem);
    });
  }

  if (errorsConfirm.length > 0) {
    errorsConfirm.forEach((error) => {
      const errorItem = document.createElement('li');
      errorItem.textContent = error;
      errorConfirmContainer.appendChild(errorItem);
    });
  }

  if (errorsName.length > 0) {
    errorsName.forEach((error) => {
      const errorItem = document.createElement('li');
      errorItem.textContent = error;
      errorNameContainer.appendChild(errorItem);
    });
  } else {
    loginCreate(email, password, confirm);
    alert(
      'Cadastro efetuado com sucesso!! Você será direcionado à página inicial para efetuar o login.
    '); // eslint-disable-line no-alert
    window.location.href = '';
  }
});

return container;
}; */
