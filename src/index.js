// React
import React from 'react';
import ReactDOM from 'react-dom';

// CSS
import 'bootstrap/dist/css/bootstrap.css';

// Containers
import App from './App';

import { setViewPort } from './mCommons/mUtils';
import toggleLanguage from './utils/toggleLanguage';

setViewPort();

String.prototype.replaceArray = function (find, replace) {
  let replaceString = this;
  let regex;
  for (let i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], 'g');
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;
};

window.toggleLanguage = toggleLanguage;

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
