import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import BoardComponent from './BoardComponent/BoardComponent'
import * as serviceWorker from './serviceWorker';
import App from "./App";
import ViewDemo from "./View/ViewDemo";

const Component = () => {
  const { pathname } = window.location;
  switch (pathname) {
    case '/':
      return <App />;
    case '/config':
      return <BoardComponent />;
    case '/demo':
      return <ViewDemo />;
    default:
      return <App />;
  }
};

ReactDOM.render(<Component />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
