import React from 'react'
import Progress from './view'
import { connect } from 'unistore/react'
import { selectStreamByUri } from '@/unistore/selectors/cache'

export default connect(
  (state, props) => {
    const { uri } = props
    const { cache, player, collections } = state
    const { favorites, downloads } = collections || {}
    const streamData = selectStreamByUri(state, uri) || {}
    return { cache, player, favorites, streamData }
  },
  {
    storePalette: 'storePalette',
    storeTrack: 'storeTrack',
    doNavigate: 'doNavigate',
    attempPlay: 'triggerAttempPlay',
    togglePlay: 'triggerTogglePlay',
    toggleFavorite: 'toggleFavorite',
    setPlaylist: 'setPlaylist',
  }
)(Progress)
