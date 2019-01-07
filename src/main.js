import React from 'react';
import ReactDOM from 'react-dom';
import Home from 'scenes/Home';
import './assets/styles/reset.css';
import './assets/styles/animation.css';

ReactDOM.render(
  <Home ref={ el => window.dice = el} />,
  document.getElementById('root'),
);
