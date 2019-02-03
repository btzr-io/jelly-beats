import React from 'react'
import { connect } from 'unistore/react'
import App from './view'

export default connect(
  'navigation, player, settings',
  {
    updateBlockHeight: 'doUpdateBlockHeight',
    checkNetworkConnection: 'checkNetworkConnection',
    handleNetworkError: 'handleNetworkError',
  }
)(App)
