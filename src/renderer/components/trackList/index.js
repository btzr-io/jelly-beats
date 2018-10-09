import React from 'react'
import Progress from './view'
import { connect } from 'unistore/react'

export default connect(
  'player',
  {
    purchase: 'purchase',
    setTrack: 'setTrack',
    doNavigate: 'doNavigate',
  }
)(Progress)
