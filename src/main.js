import { getUsers, db } from './lib/firebase.js';
import { register } from './components.js/register.js';
// import { feed } from './components.js/feed.js';
import { welcome } from './components.js/welcome.js';
// import { sobre } from './components.js/sobre.js';

const main = document.getElementById('root');

window.addEventListener('hashchange', () => {
  const hash = window.location.hash;

  switch (hash) {
    case '#register':
      main.innerHTML = '';
      main.appendChild(register());
      break;
    /*case '#feed':
      main.innerHTML = '';
      main.appendChild(feed());
      break;*/
    case '#welcome':
      main.innerHTML = '';
      main.appendChild(welcome());
      break;
    default:
      main.innerHTML = '';
      main.appendChild(welcome());
  }
});

window.addEventListener('load', () => {
  // a fução getusers é uma função assincrona e ela retorna uma promisse
  getUsers(db).then((data) => console.log(data));
  main.appendChild(welcome());
  init();
});
    