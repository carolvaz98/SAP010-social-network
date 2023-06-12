import { loginCreate } from '../lib/index.js';

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
        <form id="formulario-cadastro">
            <h1 class="register-h1"> Cadastro de usuário </h1>
                <div>
                    <label class="dados" for="nome">Nome:</label>
                    <input class="nome" type="text" id="nome" placeholder="Nome" required>
                </div>
   
                <div>
                    <label class="dados" for="email">E-mail:</label>
                    <input class="email" type="email" id="email" placeholder="contato@gmail.com" required>
                </div>
   
                <div>
                    <label class="dados" for="senha">Senha:</label>
                    <input class="senha" type="password" id="senha" placeholder="********" required>
                </div>
   
                <div>
                    <label class="dados" for="confirma-senha">Confirmar senha:</label>
                    <input class="confirmar-senha" type="password" id="confirma-senha" placeholder="********" required>
                </div>
   
                <button class="btn-register" type="submit">Cadastrar</button>

                <button class="btn-return" type="submit">Voltar</button>
        </form>
    </div> `;
  container.innerHTML = registerHTML;

  const inputName = container.querySelector('.nome');
  const inputEmail = container.querySelector('.email');
  const inputPassword = container.querySelector('.senha');
  const inputConfirm = container.querySelector('.confirmar-senha');
  const btnReturn = container.querySelector('.btn-return');
  const form = container.querySelector('#formulario-cadastro');

  btnReturn.addEventListener('click', () => {
    window.location.hash = 'welcome';
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = inputEmail.value;
    const password = inputPassword.value;
    const confirm = inputConfirm.value;
    const name = inputName.value;

    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = '';

    if (validateEmail(email) && validatePassword(password)) {
      if (confirm === password) {
        if (validateName(name)) {
          loginCreate(email, password, confirm);
          alert('Cadastro efetuado com sucesso!! Você será direcionado à página inicial para efetuar o login.'); // eslint-disable-line no-alert
          window.location.href = '';
        } else {
          const errorName = document.createElement('div');
          errorName.textContent = 'O campo nome não pode conter caracteres especiais';
          errorContainer.appendChild(errorName);
        }
      } else {
        const errorConfirm = document.createElement('div');
        errorConfirm.textContent = 'As senhas estão diferentes. Por favor, preencha os campos de senha igualmente.';
        errorContainer.appendChild(errorConfirm);
      }
    } else {
      const errorCaracter = document.createElement('div');
      errorCaracter.textContent = 'Por favor, insira um e-mail válido e uma senha com no mínimo 6 caracteres.';
      errorContainer.appendChild(errorCaracter);
    }
  });

  return container;
};
