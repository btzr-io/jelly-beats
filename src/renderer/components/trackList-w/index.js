import React from 'react'
import TrackList from './view'

import { connect } from 'unistore/react'

export default connect(
  (state, props) => {
    const { cache, player, collections } = state
    const { downloads, favorites } = collections
    const { currentTrack, paused } = player
    return { cache, downloads, favorites, currentTrack, paused }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
    storePalette: 'storePalette',
    setPlaylist: 'setPlaylist',
    doNavigate: 'doNavigate',
    attempPlay: 'triggerAttempPlay',
    togglePlay: 'triggerTogglePlay',
    toggleFavorite: 'toggleFavorite',
  }
)(TrackList)
