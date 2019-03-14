import { connect } from 'unistore/react'
import View from './view'

export default connect(
  (state, props) => {
    const { cache, collections, network } = state
    const { favorites } = collections
    const connected = network.isReady
    return { cache, favorites, network, connected }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
    storePlaylist: 'storePlaylist',
  }
)(View)
