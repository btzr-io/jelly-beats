import React from 'react'
import Header from './view'
import { connect } from 'unistore/react'

export default connect(
  (state, props) => {
    const { navigation, history } = state

    // See: https://github.com/btzr-io/jelly-beats/issues/287
    if (!history) return { navigation }

    const forwardNavigation = state.history.forward.length > 0
    const backwardNavigation = state.history.stack.length > 1
    return { navigation, backwardNavigation, forwardNavigation }
  },
  {
    doNavigate: 'doNavigate',
    doNavigateForward: 'doNavigateForward',
    doNavigateBackward: 'doNavigateBackward',
  }
)(Header)
