/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Import all the third party stuff
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
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
