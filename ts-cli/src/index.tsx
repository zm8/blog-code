import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
import './index.scss';

render(<React.StrictMode>
  <App/>
</React.StrictMode>, window.document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}