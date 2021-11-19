import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import Routers from "./router/index";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
      <Routers/>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
