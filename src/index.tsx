import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import Routers from "./router/index";
import reportWebVitals from './reportWebVitals';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

ReactDOM.render(
  <React.StrictMode>
      <Routers/>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
