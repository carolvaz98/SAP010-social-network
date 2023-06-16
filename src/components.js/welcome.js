import { loginUser, loginGoogle, loginGithub } from '../lib/index.js';

export const welcome = () => {
  const container = document.createElement('div');

  const signInHTML = `
     <section class="container-parent">
        <div class="container-img-animals">
            <img src="../img/animalsBgp.png" class="img-animals">
              <div class="sobre-petChat">
                 Conecte-se no <strong>PetChat</strong>, compartilhe dúvidas e experiências sobre seus pets,
                 faça novas conexões com amantes de animais e receba suporte em cuidados, 
                 alimentação e treinamento.
              </div>
                  <div class="containerWelcome">
                    <div class="bgContainer"></div>
                    <div class="divSignIn">
                      <img src="../img/LogoPetChat.png" class="logoPetWelcome">
                          <label class="label" for="email">E-mail:</label>
                            <div class="inputGroup">
                            <i class="material-icons inputIcon">person_outline</i>
                                <input type="email" class="inputSignIn" id="email" placeholder="example@youremail.com" required>
                  </div>

              <label class="label" for="pass">Senha:</label>
              <div class="inputGroup">
                  <i class="material-icons inputIcon">lock</i>
                  <input type="password" class="inputSignIn" id="pass" placeholder="*******" required minlength="6">
              </div>

            <button class="btnSignIn active">Entrar</button>

            <p class="textOu">----------------------------- ou -----------------------------</p>

                <button class="btnGoogle">
                  <img class="img-google" src="img/google_logo.png" />
                  Google
                </button>

                <button class="btnGitHub">
                  <img class="img-github" src="img/github.logo.png" />
                  GitHub
                </button>

              <p><a class="btnRegister"><i class="material-icons petIcon">pets</i> Criar uma conta </a></p>
          </div>
        </div>
      </div>
    </section>

            <footer>
                <p> <strong> Projeto realizado durante o Bootcamp da Laboratória </strong> </p>
                    <section class="contato">
                        <p class="nome-aluna">Caroline Protásio</p>
                        <i class="fab fa-github"></i>
                          <a href="https://github.com/carolprotasio"  target="_blank">GitHub</a> | <i class="fab fa-linkedin"></i> <a href="https://www.linkedin.com/in/carol-prot%C3%A1sio-8b4a34249/" target="_blank">Linkedin</a>
                    </section>

                    <section class="contato">
                        <p class="nome-aluna">Caroline Vaz</p>
                        <i class="fab fa-github"></i>
                          <a href="https://github.com/carolvaz98"  target="_blank">GitHub</a> | <i class="fab fa-linkedin"></i> <a href="https://www.linkedin.com/in/caroline-v-b95019121/" target="_blank">Linkedin</a>
                    </section>

                    <section class="contato">
                        <p class="nome-aluna">Myllena M. Martins</p>
                        <i class="fab fa-github"></i>
                          <a href="https://github.com/myllenammartins"  target="_blank">GitHub</a> | <i class="fab fa-linkedin"></i> <a href="https://www.linkedin.com/in/myllenamirandamartins/" target="_blank">Linkedin</a>
                    </section>
            </footer>
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
