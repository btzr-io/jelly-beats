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
    setPlaylist: 'setPlaylist',
    doNavigate: 'doNavigate',
    attempPlay: 'triggerAttempPlay',
    togglePlay: 'triggerTogglePlay',
    toggleFavorite: 'toggleFavorite',
  }
)(Progress)
