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
    const { currentTrack, currentPlaylist } = player
    const { uri, name, index } = currentPlaylist
    const tracks = selectPlaylistQueue(state, uri || name) || []
    const totalTracks = tracks.length
    const canPlayPrev = totalTracks > 1 && index > 0
    const canPlayNext = totalTracks > 1 && index < tracks.length - 1
    const isFavorite = favorites.indexOf(currentTrack.uri) > -1

    return {
      player,
      cache,
      downloads,
      favorites,
      isFavorite,
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
    toggleFavorite: 'toggleFavorite',
    updateStreamInfo: 'updateStreamInfo',
    updatePlayerStatus: 'updatePlayerStatus',
  }
)(Player)
