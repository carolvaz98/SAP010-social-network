//import { db, auth } from '../firebase';
import { userStateLogout, userAuthChanged } from '../lib/index.js'

export const feed = () => {
  const container = document.createElement('div');
  const feedHTML = `
    <main class='bg'>  
      <nav>
        <img src="../img/logo-petChat-bg.png" alt="LogoPetChat" class="logo">
        <ul>
          <li id="username"></li>
        </ul>

        <button type="submit" class="btn-sair"> Sair </button>

      </nav>

      <section class="main">  
        <div id="commentsContainer">
        <form id="commentForm">
          <textarea id="commentInput" placeholder="Digite seu comentário"></textarea>
          <button type="submit" class="btn-enviar">Enviar</button>
        </form>
        </div>
      </section>

    <main>
    `; container.innerHTML = feedHTML;
  const commentsContainer = container.querySelector('#commentsContainer');
  const commentForm = container.querySelector('#commentForm');
  const commentInput = container.querySelector('#commentInput');
  const logoutElement = container.querySelector('#logout');
  const usernameElement = container.querySelector('#username');
  const submitElement = container.querySelector('#submit');

  logoutElement.addEventListener('click', async () => {
    try {
      // eslint-disable-next-line no-console
      console.log('Deslogado');
      await userStateLogout(userAuthChanged);
      window.location.href = '#welcome';
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error: Não foi possivel fazer o logout: ', error);
    }
  });

  return container;
};
