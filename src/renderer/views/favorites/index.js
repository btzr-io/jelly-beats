import { connect } from 'unistore/react'
import { selectPlaylistDuration } from '@/unistore/selectors/player'
import View from './view'

export default connect(
  (state, props) => {
    const { cache, collections } = state
    const { favorites } = collections
    const duration = selectPlaylistDuration(state, favorites)
    const playlist = { uri: 'favorites', name: 'Favorites' }
    return { cache, tracks: favorites, playlist, duration }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
  }
)(View)
