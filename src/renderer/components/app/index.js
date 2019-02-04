import React from 'react'
import { connect } from 'unistore/react'
import App from './view'

export default connect(
  state => {
    const { navigation, player, settings } = state
    const AppStateReady = settings !== undefined
    return { AppStateReady, navigation, player, settings }
  },

  {
    updateBlockHeight: 'doUpdateBlockHeight',
    checkNetworkConnection: 'checkNetworkConnection',
    handleNetworkError: 'handleNetworkError',
  }
)(App)
