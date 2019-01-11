import React from 'react'
import Progress from './view'
import { connect } from 'unistore/react'

export default connect(
  'cache, player, favorites, downloads',
  {
    purchase: 'purchase',
    setTrack: 'setTrack',
    doNavigate: 'doNavigate',
    togglePlay: 'triggerTogglePlay',
    toggleFavorite: 'toggleFavorite',
  }
)(Progress)
