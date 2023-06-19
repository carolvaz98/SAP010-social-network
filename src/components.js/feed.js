import { db, auth } from '../lib/firebase.js';
import {
  userStateLogout,
  userAuthChanged,
  addPost,
  getPosts,
} from '../lib/index.js';
/* import { createPost, listAllPosts } from '../firebase/firebase' */

export const feed = () => {
  const container = document.createElement('div');
  const feedHTML = `
    <div class='bg'>  
      <nav class="nav">
        <img src="../img/logo-petChat-bg.png" alt="LogoPetChat" class="logo">
        <ul>
          <li id="username"></li>
        </ul>

        <button type="submit" class="btn-sair" id="logout"> Sair </button>

      </nav>

      <section class="main">  
        <div id="commentsContainer">
        <form id="commentForm">
          <textarea id="commentInput" placeholder="Digite seu comentário"></textarea>
          <button type="submit" class="btn-enviar">Enviar</button>
        </form>
        <div id="commentSection"></div>
        </div>
      </section>

    <div>
    `; container.innerHTML = feedHTML;
  const commentsContainer = container.querySelector('#commentsContainer');
  const commentForm = container.querySelector('#commentForm');
  const commentInput = container.querySelector('#commentInput');
  const logoutElement = container.querySelector('#logout');
  const usernameElement = container.querySelector('#username');
  const submitElement = container.querySelector('.btn-enviar');
  const commentSection = container.querySelector('commentSection');

  // BOTÃO DE SAIR
  logoutElement.addEventListener('click', async () => {
    try {
    // eslint-disable-next-line no-console
      console.log('loged out');
      userStateLogout(userAuthChanged);
      window.location.href = '';
    } catch (erro) {
      // eslint-disable-next-line no-console
      console.log('Erro ao deslogar', erro);
    }
  });
  return container;
};
