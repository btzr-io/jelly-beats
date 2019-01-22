import React from 'react'
import Progress from './view'
import { connect } from 'unistore/react'

export default connect(
  (state, props) => {
    const { cache, player, collections } = state
    const { favorites, downloads } = collections || {}
    return { cache, player, favorites, downloads }
  },
  {
    purchase: 'purchase',
    setTrack: 'setTrack',
    storeTrack: 'storeTrack',
    doNavigate: 'doNavigate',
    togglePlay: 'triggerTogglePlay',
    toggleFavorite: 'toggleFavorite',
  }
)(Progress)
