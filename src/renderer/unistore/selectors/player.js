import moment from 'moment'
import { selectStreamByUri } from '@/unistore/selectors/cache'

// TODO: REFACTOR
export const selectPlaylistQueue = ({ collections, playlists }, uri) => {
  let playlist = []
  let collection = collections[uri]
  const isArray = Array.isArray(collection)

  if (collection && !isArray) {
    // Object
    return Object.keys(collection)
  } else if (collection && isArray) {
    /// Array of objects
    if (collection.length > 0 && collection[0].uri) {
      return collection.map(track => track.uri)
    }
    // Array of strings
    return collection
  } else if (playlists[uri]) {
    // playlist
    return playlists[uri].list
  }

  // Empty
  return playlist
}

export const selectPlaylistDuration = (state, tracks = []) => {
  let duration = 0

  tracks
    .map(uri => selectStreamByUri(state, uri))
    .map(track => {
      if (track && track.duration) {
        duration += track.duration
      }
    })
  return duration ? moment.duration(duration, 'seconds').humanize() : '?'
}

export const selectPlaylistByUri = ({ playlists }, uri) => {
  return playlists[uri]
}

export const selectTrackIndexByUri = (state, trackUri) => {
  const { player, playlists } = state
  const { uri } = player.currentPlaylist
  const playlist = selectPlaylistQueue(state, uri)
  return playlists && playlist.indexOf(trackUri)
}
