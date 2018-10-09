import React from 'react'
import Progress from './view'
import { connect } from 'unistore/react'

export default connect(
  'player, favorites, downloads',
  {
    purchase: 'purchase',
    setTrack: 'setTrack',
    doNavigate: 'doNavigate',
    toggleFavorite: 'toggleFavorite',
  }
)(Progress)
