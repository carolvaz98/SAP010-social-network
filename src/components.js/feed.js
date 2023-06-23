import { db, auth } from '../lib/firebase.js';
import {
  userStateLogout,
  userAuthChanged,
  addPost,
  getPosts,
  deletePost,
  updatePost,
  likePost,

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
      // eslint-disable-next-line no-console
      console.log('logged out');
      userStateLogout(userAuthChanged);
      window.location.href = '';
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Erro ao deslogar', error);
    }
  });

  // ADICIONA O NOME DO USUÁRIO
  userAuthChanged((user) => {
    if (user) {
      usernameElement.textContent = `Boas vindas, ${user.displayName}🐶`;
    }
  });

  // TRAZ OS COMENTÁRIOS
  async function displayComments() {
    commentSection.innerHTML = ''; // Limpa o conteúdo anterior dos comentários

    try {
      const comments = await getPosts(db);

      // Ordenar os comentários por data
      // comments.sort((a, b) => new Date(a.data) - new Date(b.data));

      comments.forEach((post) => {
        const postContainer = document.createElement('div');
        postContainer.innerHTML = `
          <div class="posts">
            <div class="barra">
              <p class="usuario">${post.Usuario}</p>
              <p class="data">${post.data}</p>
            </div>
            <p class="comentario">${post.Comentario}</p>
            <a class="btn-like${post.like && post.like.includes(auth.currentUser.uid) ? ' liked' : ''}" data-comment-id="${post.id}">❤️</a>
            <span class="likeCount">${post.likeCount}</span>
            ${post.Usuario === auth.currentUser.displayName ? `
              <a class="btn-edit">✏️</a>
              <a class="btn-delete">🗑️</a>
            ` : ''}
          </div>
        `;

        const editButton = postContainer.querySelector('.btn-edit');
        const deleteButton = postContainer.querySelector('.btn-delete');
        const likeButton = postContainer.querySelector('.btn-like');
        const likeCountElement = postContainer.querySelector('.likeCount');

        // BOTÃO DE EDITAR O COMENTÁRIO
        if (editButton) {
          editButton.addEventListener('click', () => {
            // eslint-disable-next-line no-alert
            const confirmEdit = window.prompt('Digite o novo comentário:');
            if (confirmEdit) {
              updatePost(post.id, { Comentario: confirmEdit })
                .then(() => {
                  // Atualiza a exibição dos comentários após editar um comentário
                  displayComments();
                })
                .catch((error) => {
                  // eslint-disable-next-line no-console
                  console.log('Erro ao editar o comentário:', error);
                });
            }
          });
        }
        // BOTÃO DE DELETAR O COMENTÁRIO
        if (deleteButton) {
          deleteButton.addEventListener('click', () => {
            // eslint-disable-next-line no-alert
            const confirmDelete = window.confirm('Deseja excluir este comentário?');
            if (confirmDelete) {
              deletePost(post.id)
                .then(() => {
                  // Atualiza a exibição dos comentários após excluir um comentário
                  displayComments();
                })
                .catch((error) => {
                  // eslint-disable-next-line no-console
                  console.log('Erro ao excluir o comentário:', error);
                });
            }
          });
        }
        // FUNÇÃO DE DAR O LIKE
        likeButton.addEventListener('click', async () => {
          const commentId = likeButton.dataset.commentId;
          const userLiked = likeButton.classList.contains('liked');

          await likePost(commentId, !userLiked);

          if (userLiked) {
            likeButton.classList.remove('liked');
            likeButton.textContent = '❤️';
            likeCountElement.textContent = parseInt(likeCountElement.textContent, 10) - 1;
          } else {
            likeButton.classList.add('liked');
            likeButton.textContent = '😻';
            likeCountElement.textContent = parseInt(likeCountElement.textContent, 10) + 1;
          }
        });

        commentSection.appendChild(postContainer);
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Erro ao carregar os comentários:', error);
    }
  }

  // GUARDA OS COMENTÁRIOS
  commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const commentText = commentInput.value.trim();
    if (commentText === '') {
      return; // Retorna se o comentário estiver vazio
    }

    const commentData = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    // objeto com as informações do comentário
    const comment = {
      Usuario: auth.currentUser.displayName,
      Comentario: commentText,
      data: commentData,
      likeCount: 0,
    };

    // adiciona o comentário ao banco de dados
    try {
      await addPost(db, comment);
      // Limpa o campo de entrada de comentário
      commentInput.value = '';
      // Atualiza a exibição dos comentários após adicionar um novo comentário
      displayComments();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Erro ao adicionar o comentário:', error);
    }
  });

  displayComments();

  return container;
};
