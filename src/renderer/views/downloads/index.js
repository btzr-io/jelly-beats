import { connect } from 'unistore/react'
import { selectPlaylistDuration } from '@/unistore/selectors/player'
import View from './view'

export default connect((state, props) => {
  const { cache, collections } = state
  const { downloads } = collections
  const tracks = Object.keys(downloads)
  const duration = selectPlaylistDuration(state, tracks)
  const playlist = { uri: 'downloads', name: 'Downloads' }
  return { cache, tracks, playlist, duration }
})(View)
