import React from 'react';
import { Router, Route,  } from 'dva/router';
import IndexPage from './routes/IndexPage';
import otherPage from './routes/otherPage';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/otherPage" component={otherPage} />
    </Router>
  );
}

export default RouterConfig;
