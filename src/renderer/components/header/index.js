import React from 'react'
import Header from './view'
import { connect } from 'unistore/react'

export default connect(
  (state, props) => {
    const { navigation, history, account } = state
    const { currentChannel } = account || {}
    const forwardNavigation = state.history.forward.length > 0
    const backwardNavigation = state.history.stack.length > 1
    return { navigation, currentChannel, backwardNavigation, forwardNavigation }
  },
  {
    doNavigate: 'doNavigate',
    doNavigateForward: 'doNavigateForward',
    doNavigateBackward: 'doNavigateBackward',
  }
)(Header)
