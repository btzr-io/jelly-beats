import React from 'react'
import Player from './view'
import { connect } from 'unistore/react'
import { selectPlaylistQueue } from '@/unistore/selectors/player'

export default connect(
  (state, props) => {
    const { player, cache, collections } = state

    // See: https://github.com/btzr-io/jelly-beats/issues/287
    if (!player) return {}
    const { favorites, downloads } = collections
    const { uri, name, index } = player.currentPlaylist
    const tracks = selectPlaylistQueue(state, uri || name) || []
    const totalTracks = tracks.length
    const canPlayPrev = totalTracks > 1 && index > 0
    const canPlayNext = totalTracks > 1 && index < tracks.length - 1
    const currentPlaylist = { uri, name, totalTracks }
    return {
      player,
      cache,
      downloads,
      favorites,
      currentPlaylist,
      canPlayNext,
      canPlayPrev,
    }
  },
  {
    doNavigate: 'doNavigate',
    playNext: 'triggerPlayNext',
    playPrev: 'triggerPlayPrevious',
    togglePlay: 'triggerTogglePlay',
    updateStreamInfo: 'updateStreamInfo',
    updatePlayerStatus: 'updatePlayerStatus',
  }
)(Player)
