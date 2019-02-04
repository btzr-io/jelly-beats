import { connect } from 'unistore/react'
import View from './view'

export default connect(
  (state, props) => {
    const { cache, collections, network } = state
    const { favorites } = collections
    return { cache, favorites, network }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
    storePlaylist: 'storePlaylist',
  }
)(View)
