import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import './index.css';

import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import * as reducers from './state/reducers'
import * as actions from './state/actions'

import { getCookie } from './util/cookie'

const store = createStore(combineReducers(reducers))

store.subscribe(() => console.log('CHANGE STATE:', store.getState()))

ReactDOM.render(
  <LocaleProvider locale={ enUS }>
    <Provider store={ store }>
      <App />
    </Provider>
  </LocaleProvider>,
  document.getElementById('root')
)
