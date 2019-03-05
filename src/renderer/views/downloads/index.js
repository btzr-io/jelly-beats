import { connect } from 'unistore/react'
import { selectPlaylistDuration } from '@/unistore/selectors/player'
import View from './view'

export default connect(
  (state, props) => {
    const { cache, collections } = state
    const { downloads, favorites } = collections
    const tracks = Object.keys(downloads)
    const duration = selectPlaylistDuration(state, tracks)
    const loadingTracks = tracks.filter(uri => !cache[uri])
    const playlist = { uri: 'downloads', name: 'Downloads' }
    return { tracks, playlist, loadingTracks, duration }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
    toggleFavorite: 'toggleFavorite',
    setPlaylist: 'setPlaylist',
  }
)(View)
