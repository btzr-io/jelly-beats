import { connect } from 'unistore/react'
import { selectPlaylistDuration } from '@/unistore/selectors/player'
import View from './view'

export default connect(
  (state, props) => {
    const { cache, collections } = state
    const { downloads, favorites } = collections
    const tracks = favorites // Object.keys(downloads)
    const duration = 0 //selectPlaylistDuration(state, tracks)
    const playlist = { uri: 'downloads', name: 'Downloads' }
    return { tracks, cache, playlist, duration }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
    toggleFavorite: 'toggleFavorite',
    setPlaylist: 'setPlaylist',
  }
)(View)
