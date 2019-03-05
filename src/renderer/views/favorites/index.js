import { connect } from 'unistore/react'
import { selectPlaylistDuration } from '@/unistore/selectors/player'
import View from './view'

export default connect(
  (state, props) => {
    const { cache, collections } = state
    const { favorites } = collections
    const duration = selectPlaylistDuration(state, favorites)
    const tracks = favorites
    const loadingTracks = tracks.filter(uri => !cache[uri])
    const playlist = { uri: 'favorites', name: 'Favorites' }
    return { tracks, playlist, duration, loadingTracks }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
  }
)(View)
