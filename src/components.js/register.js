import { loginCreate, emailDuplicate } from '../lib/index.js';

export const register = () => {
  const container = document.createElement('div');
  const registerHTML = `
    <div class="register-elements">
      <div class="containerRegister">
        <form id="formulario-cadastro">
          <img src="img/LogoPetChat.png" class="logoPetRegister">
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
    const name = inputName.value;

    // Limpar erros anteriores
    errorNameContainer.innerHTML = '';
    errorEmailContainer.innerHTML = '';
    errorPasswordContainer.innerHTML = '';
    errorConfirmContainer.innerHTML = '';

    // Validar nome
    if (name === '') {
      errorNameContainer.innerHTML = '<li>Por favor, informe seu nome.</li>';
    }

    // Validar e-mail
    if (email === '') {
      errorEmailContainer.innerHTML = '<li>Por favor, informe seu e-mail.</li>';
    } else if (!email.includes('@')) {
      errorEmailContainer.innerHTML = '<li>Por favor, informe um e-mail válido.</li>';
    } else if (await emailDuplicate(email)) {
      errorEmailContainer.innerHTML = '<li>O e-mail informado já está em uso.</li>';
    }

    // Validar senha
    if (password === '') {
      errorPasswordContainer.innerHTML = '<li>Por favor, informe sua senha.</li>';
    } else if (password.length < 6) {
      errorPasswordContainer.innerHTML = '<li>A senha deve ter pelo menos 6 caracteres.</li>';
    }

    // Validar confirmação de senha
    if (inputConfirmPassword.value !== password) {
      errorConfirmContainer.innerHTML = '<li>As senhas informadas não coincidem.</li>';
    }

    // Se não houver erros, criar o usuário
    if (errorNameContainer.innerHTML === '' && errorEmailContainer.innerHTML === '' && errorPasswordContainer.innerHTML === '' && errorConfirmContainer.innerHTML === '') {
      try {
        await loginCreate(email, password, name);
        // eslint-disable-next-line no-alert
        alert('Cadastro efetuado com sucesso!! Você será direcionado à página inicial para efetuar o login.');
        window.location.href = '';
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        // eslint-disable-next-line no-alert
        alert('Ocorreu um erro ao criar o usuário, tente novamente.');
      }
    }
  });

  return container;
};
