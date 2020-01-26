import './style/style.css';
import * as firebase from 'firebase/app';
import template from './view/template';
import 'firebase/auth';
import 'firebase/firestore';

export default class GoogleAuth {
  constructor() {
    this.template = template;
    this.firebaseConfig = {
      apiKey: 'AIzaSyBk_T_F4GYhFYnMveH_Cq_x2tYNUuWyGX8',
      authDomain: 'piskel-clone-slolkunchik.firebaseapp.com',
      databaseURL: 'https://piskel-clone-slolkunchik.firebaseio.com',
      projectId: 'piskel-clone-slolkunchik',
      storageBucket: 'piskel-clone-slolkunchik.appspot.com',
      messagingSenderId: '692454956895',
      appId: '1:692454956895:web:960dd8866650289419a0ea',
    };
    this.buttonSelector = '.google_Auth_button';
  }

  init() {
    this.render();
    this.initClickListeners();
    firebase.initializeApp(this.firebaseConfig);
  }

  initClickListeners() {
    const authButton = document.querySelector(this.buttonSelector);
    authButton.addEventListener('click', () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
        const userName = result.additionalUserInfo.profile.name;
        const userPicture = result.additionalUserInfo.profile.picture;
        authButton.innerText = `Hello, ${userName}`;
        authButton.style.paddingRight = '40px';
        authButton.style.backgroundImage = `url(${userPicture})`;
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        // eslint-disable-next-line no-console
        console.log('Failed sign in');
      });
    });
  }

  render() {
    document.querySelector('.nav').insertAdjacentHTML('beforeend', this.template);
  }
}
