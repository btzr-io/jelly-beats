import React from 'react'
import Player from './view'
import { connect } from 'unistore/react'
import { selectPlaylistQueue } from '@/unistore/selectors/player'

export default connect(
  (state, props) => {
    const { player, cache, collections, settings, navigation } = state
    const { favorites, downloads } = collections
    const { currentTrack, currentPlaylist } = player
    const { uri, name, index } = currentPlaylist
    const tracks = selectPlaylistQueue(state, uri) || []
    const totalTracks = tracks.length
    const canPlayPrev = totalTracks > 1 && index > 0
    const canPlayNext = totalTracks > 1 && index < tracks.length - 1
    const isFavorite = favorites.indexOf(currentTrack.uri) > -1
    const isPlayingCollection = uri && collections[uri] ? true : false
    const streamStatus = downloads[currentTrack.uri] || {}

    return {
      player,
      cache,
      settings,
      downloads,
      favorites,
      isFavorite,
      navigation,
      canPlayNext,
      canPlayPrev,
      currentPlaylist,
      isPlayingCollection,
      streamStatus,
    }
  },
  {
    doNavigate: 'doNavigate',
    doNavigateBackward: 'doNavigateBackward',
    playNext: 'triggerPlayNext',
    playPrev: 'triggerPlayPrevious',
    togglePlay: 'triggerTogglePlay',
    toggleFavorite: 'toggleFavorite',
    updateStreamInfo: 'updateStreamInfo',
    updatePlayerStatus: 'updatePlayerStatus',
    storeTrackDuration: 'storeTrackDuration',
  }
)(Player)
