import "babel-polyfill"

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga';

import Form from './Form';
import reducer from './reducers'
import rootSaga from "./saga";

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga);


function render() {
  ReactDOM.render(
    <Form store={store} />,
    document.getElementById('root')
  )
}

render()
store.subscribe(render);
