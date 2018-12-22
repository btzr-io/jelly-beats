import React from 'react'
import { connect } from 'unistore/react'
import App from './view'

export default connect(
  'navigation, player',
  { updateBlockHeight: 'doUpdateBlockHeight' }
)(App)
