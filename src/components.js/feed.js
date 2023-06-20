import { db, auth } from '../lib/firebase.js';
import {
  userStateLogout,
  userAuthChanged,
  addPost,
  getPosts,
  deletePost,
  updatePost,

} from '../lib/index.js';

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

    </div>
  `;
  container.innerHTML = feedHTML;

  const commentForm = container.querySelector('#commentForm');
  const commentInput = container.querySelector('#commentInput');
  const logoutElement = container.querySelector('#logout');
  const usernameElement = container.querySelector('#username');
  const commentSection = container.querySelector('#commentSection');

  // BOTÃO DE SAIR
  logoutElement.addEventListener('click', async () => {
    try {
      console.log('logged out');
      userStateLogout(userAuthChanged);
      window.location.href = '';
    } catch (error) {
      console.log('Erro ao deslogar', error);
    }
  });

  // ADICIONA O NOME DO USUÁRIO
  userAuthChanged((user) => {
    if (user) {
      usernameElement.textContent = user.displayName;
    }
  });

  // GUARDA OS COMENTÁRIOS
  commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const commentText = commentInput.value;
    const commentData = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // objeto com as informações do comentário
    const comment = {
      Usuario: auth.currentUser.displayName,
      Comentario: commentText,
      data: commentData,
      likes: [],
    };

    // adiciona o comentário ao banco de dados
    try {
      await addPost(db, comment);

      // Limpa o campo de entrada de comentário
      commentInput.value = '';
    } catch (error) {
      console.log('Erro ao adicionar o comentário:', error);
    }
  });

  // TRAZ OS COMENTÁRIOS
  async function displayComments() {
    try {
      const comments = await getPosts(db);

      comments.forEach((post) => {
        const postContainer = document.createElement('div');
        postContainer.innerHTML = `
          <p><strong>Usuário:</strong> ${post.Usuario}</p>
          <p><strong>Comentário:</strong> ${post.Comentario}</p>
          <p>${post.data}</p>
          <p>${post.likes}</p>
          <button type="button" class="btn-edit">Editar</button>
          <button type="button" class="btn-delete">Deletar</button>
        `;

        const editButton = postContainer.querySelector('.btn-edit');
        const deleteButton = postContainer.querySelector('.btn-delete');

        editButton.addEventListener('click', () => {
          const editComment = prompt('Digite o novo comentário:');
          if (editComment) {
            updatePost(post.id, { Comentario: editComment });
          }
        });

        deleteButton.addEventListener('click', () => {
          if (confirm('Deseja excluir este comentário?')) {
            deletePost(post.id);
          }
        });

        commentSection.appendChild(postContainer);
      });
    } catch (error) {
      console.log('Erro ao obter os comentários:', error);
    }
  }

  displayComments();

  return container;
};
