import { connect } from 'unistore/react'
import View from './view'

export default connect(
  (state, props) => {
    const { cache, collections, podcasts } = state
    const { favorites } = collections || {}
    return { cache, favorites, podcasts }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
    storePlaylist: 'storePlaylist',
  }
)(View)
