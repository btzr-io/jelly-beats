import { connect } from 'unistore/react'
import { selectPlaylistQueue, selectPlaylistDuration } from '@/unistore/selectors/player'
import View from './view'

export default connect(
  (state, props) => {
    const { options } = props
    const { uri, name } = options || {}
    const { cache } = state

    if (!uri) return { cache }

    const tracks = selectPlaylistQueue(state, uri) || []
    const duration = selectPlaylistDuration(state, tracks)
    const playlist = { uri, name }

    return { cache, tracks, playlist, duration }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
  }
)(View)
