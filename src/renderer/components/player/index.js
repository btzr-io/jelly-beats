import React from 'react'
import Player from './view'
import { connect } from 'unistore/react'
import { selectStreamByUri } from '@/unistore/selectors/cache'
import { selectPlaylistQueue } from '@/unistore/selectors/player'

export default connect(
  (state, props) => {
    const { player, cache, streams, collections, settings, navigation } = state
    const { favorites } = collections
    const { currentTrack, currentPlaylist } = player
    const { uri, name, index } = currentPlaylist
    const tracks = selectPlaylistQueue(state, uri)
    const totalTracks = tracks.length
    const canPlayPrev = totalTracks > 1 && index > 0
    const canPlayNext = totalTracks > 1 && index < tracks.length - 1
    const isFavorite = favorites.indexOf(currentTrack.uri) > -1
    const isPlayingCollection = uri && collections[uri] ? true : false
    const fileSource = selectStreamByUri(state, currentTrack.uri) || {}
    const streamSource = streams[currentTrack.uri]
    const isLoading = fileSource.isDownloading || (streamSource && !streamSource.ready)

    return {
      player,
      cache,
      settings,
      favorites,
      isLoading,
      isFavorite,
      navigation,
      canPlayNext,
      canPlayPrev,
      fileSource,
      streamSource,
      currentPlaylist,
      isPlayingCollection,
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
    updateFileSourceInfo: 'updateFileSourceInfo',
  }
)(Player)
