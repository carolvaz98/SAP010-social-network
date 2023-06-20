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
      usernameElement.textContent = `Bem vindo(a) ${user.displayName}`;
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
      // Curtir: {},
    };

    // adiciona o comentário ao banco de dados
    try {
      await addPost(db, comment);
      // Limpa o campo de entrada de comentário
      commentInput.value = '';
      // Atualiza a exibição dos comentários após adicionar um novo comentário
      displayComments();
    } catch (error) {
      console.log('Erro ao adicionar o comentário:', error);
    }
  });

  // TRAZ OS COMENTÁRIOS
  async function displayComments() {
    commentSection.innerHTML = ''; // Limpa o conteúdo anterior dos comentários
    try {
      const comments = await getPosts(db);

      comments.forEach((post) => {
        const postContainer = document.createElement('div');
        postContainer.innerHTML = `
        <div class="posts">
          <div class="barra">
          <p class="usuario"><strong>Usuário:</strong> ${post.Usuario}</p></div>
          <p class="comentario"><strong>Comentário:</strong> ${post.Comentario}</p>
          <p class="data">${post.data}</p>
          <span class="countLikes">0</span>
          <button class="btn-edit">Editar</button>
          <button class="btn-delete">Deletar</button>
          <button class="btn-like" data-comment-id="${post.id}">Curtir</button>
        </div>
        `;

        const editButton = postContainer.querySelector('.btn-edit');
        const deleteButton = postContainer.querySelector('.btn-delete');
        const likeButton = postContainer.querySelector('.btn-like');
        //const countLikes = postContainer.querySelector('.countLikes');

        // Verifica se o usuário atual já curtiu o comentário
        const userLiked = post.Curtir && post.Curtir[auth.currentUser.uid];

        // Define o estado inicial do botão de curtir com base no usuário atual
        likeButton.textContent = userLiked ? 'Descurtir' : 'Curtir';

        // BOTÃO DE EDITAR O COMENTÁRIO
        editButton.addEventListener('click', () => {
          const editComment = prompt('Digite o novo comentário:');
          if (editComment) {
            updatePost(post.id, { Comentario: editComment })
              .then(() => {
                // Atualiza a exibição dos comentários após editar um comentário
                displayComments();
              })
              .catch((error) => {
                console.log('Erro ao editar o comentário:', error);
              });
          }
        });

        // BOTÃO DE DELETAR O COMENTÁRIO
        deleteButton.addEventListener('click', () => {
          if (confirm('Deseja excluir este comentário?')) {
            deletePost(post.id)
              .then(() => {
                // Atualiza a exibição dos comentários após excluir um comentário
                displayComments();
              })
              .catch((error) => {
                console.log('Erro ao excluir o comentário:', error);
              });
          }
        });

        /* /// FUNÇÃO DE DAR O LIKE
        likeButton.addEventListener('click', async () => {
          const commentId = likeButton.getAttribute('data-comment-id');

          if (userLiked) {
            // Se o usuário já curtiu, remove a curtida
            await updatePost(post.id, {
              [`Curtir.${auth.currentUser.uid}`]: false, // Atualiza o valor para false
            });
            countLikes.textContent = Number(countLikes.textContent) - 1;
            likeButton.textContent = 'Curtir';
          } else {
            // Se o usuário ainda não curtiu, adiciona a curtida
            await updatePost(post.id, {
              [`Curtir.${auth.currentUser.uid}`]: true, // Atualiza o valor para true
            });
            countLikes.textContent = Number(countLikes.textContent) + 1;
            likeButton.textContent = 'Descurtir';
          }
        }); */

        commentSection.appendChild(postContainer);
      });
    } catch (error) {
      console.log('Erro ao carregar os comentários:', error);
    }
  }

  displayComments();

  return container;
};
