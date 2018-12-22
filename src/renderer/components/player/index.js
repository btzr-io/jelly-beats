import React from 'react'
import Player from './view'
import { connect } from 'unistore/react'

export default connect(
  'player, cache, downloads',
  {
    doNavigate: 'doNavigate',
    togglePlay: 'triggerTogglePlay',
    updateStreamInfo: 'updateStreamInfo',
    updatePlayerStatus: 'updatePlayerStatus',
  }
)(Player)
