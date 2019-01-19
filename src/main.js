import React from 'react';
import ReactDOM from 'react-dom';
import Home from 'scenes/Home';
import { IntlProvider, addLocaleData } from 'react-intl';
import getMessage from 'services/intl.data.js';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import es from 'react-intl/locale-data/es';
import './assets/styles/reset.css';
import './assets/styles/animation.css';

addLocaleData([...en, ...zh, ...es]);

const defaultLanguage = 'zh-TW';
const local = defaultLanguage.split('-').pop().toLowerCase();

ReactDOM.render(
  <IntlProvider locale={defaultLanguage} key={defaultLanguage} messages={getMessage(local)}>
    <Home ref={ el => window.dice = el} />
  </IntlProvider>,
  document.getElementById('root'),
);
