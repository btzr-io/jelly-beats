/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Tell Babel to transform JSX into h() calls:

import { h, render, Component } from 'preact'
// Tell Babel to transform JSX into h() calls:
/** @jsx h */
import { Provider } from 'preact-redux'
import UniversalRouter from 'universal-router'
import history from 'history'
import App from './components/app'
import store from './store'

const MOUNT_NODE = document.getElementById('app')

// Render content
render(
  <Provider store={store}>
    <App />
  </Provider>,
  MOUNT_NODE
)
