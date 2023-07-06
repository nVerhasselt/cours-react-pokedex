import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx'; //Notre composant App

ReactDOM.render(
  <App />,
  document.getElementById('root') //sera envoyé dans le index.html entre les balises contenant l'id 'root'.
);