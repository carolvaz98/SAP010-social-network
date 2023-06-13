import { loginUser, loginGoogle, loginGithub } from '../lib/index.js';

export const welcome = () => {
  const container = document.createElement('div');

  const signInHTML = `
<section class="mainPage">
  <div class="bgContainer">
  <img src="../img/comunicacao.jpg" class="bg">
  </div>
    <div class="divSignIn">
      <img src="img/logo_petchat.png" class="logoW">
         <p class="introSignIn">Bem-vindo(a) ao <strong>PetChat</strong></p>
         <label class='label' for="email">E-mail:</label>

         <div class="inputGroup">
           <i class="material-icons inputIcon">person_outline</i>
           <input type="email" class="inputSignIn" id="email" placeholder="example@youremail.com" required>
         </div>

         <label class='label' for="pass">Senha:</label>
         <div class="inputGroup">
           <i class="material-icons inputIcon">lock</i>
             <input type="password" class="inputSignIn" id="pass" placeholder="*******" required minlength="6">
         </div>

         <button class="btnSignIn active">Sign In</button>
         <p class="textOu">----------------------------- ou -----------------------------</p>
            
         <button class="btnGoogle">
           <img class="img-google" src="img/google_logo.png"/>
             Sign in com o Google
         </button>

         <button class="btnGitHub">
         <img class="img-github" src="img/github.logo.png"/>
           Sign in com o GitHub
       </button>
       <p><a class="btnRegister"><i class="material-icons petIcon">pets</i> Criar uma conta </a></p>
    </div>
</section>
`;

  container.innerHTML = signInHTML;

  const inputEmail = container.querySelector('.inputSignIn[type="email"]');
  const inputPass = container.querySelector('.inputSignIn[type="password"]');
  const btnSignIn = container.querySelector('.btnSignIn');
  const btnRegister = container.querySelector('.btnRegister');
  const btnGoogle = container.querySelector('.btnGoogle');
  const btnGitHub = container.querySelector('.btnGitHub');

  // BOTÃO PARA SE LOGAR (USUÁRIO EXISTENTE)
  btnSignIn.addEventListener('click', async (event) => {
    event.preventDefault();

    const email = inputEmail.value;
    const password = inputPass.value;

    if (email && password) {
      loginUser(email, password);
      window.location.hash = '#feed';
    }
  });

  // BOTÃO PARA SE CADASTRAR (NOVO USUÁRIO)
  btnRegister.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.hash = '#register';
  });

  // LOGAR COM O GOOGLE
  btnGoogle.addEventListener('click', async (event) => {
    event.preventDefault();
    loginGoogle();
    window.location.hash = '#feed';
  });

  // LOGAR COM O GITHUB
  btnGitHub.addEventListener('click', async (event) => {
    event.preventDefault();
    loginGithub();
    window.location.hash = '#feed';
  });

  return container;
};
