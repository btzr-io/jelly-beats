import { connect } from 'unistore/react'
import View from './view'

export default connect(
  (state, props) => {
    const { cache, collections, network, searchQuery } = state
    const { favorites } = collections
    const connected = network.isReady
    return { cache, favorites, network, connected, searchQuery }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
    storePlaylist: 'storePlaylist',
    updateSearchQuery: 'updateSearchQuery',
  }
)(View)
