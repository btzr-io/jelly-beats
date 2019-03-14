import React from 'react'
import { connect } from 'unistore/react'
import App from './view'

export default connect(
  'ready, hydrated, navigation, player, settings',
  {
    updateBlockHeight: 'doUpdateBlockHeight',
    checkNetworkConnection: 'checkNetworkConnection',
    handleNetworkError: 'handleNetworkError',
  }
)(App)
