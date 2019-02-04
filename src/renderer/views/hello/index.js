import { connect } from 'unistore/react'
import View from './view'

export default connect(
  (state, props) => {
    const { cache, collections, network } = state
    const { favorites } = collections
    const connectionCode = network.connection.code
    return { cache, favorites, network, connectionCode }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
    storePlaylist: 'storePlaylist',
  }
)(View)
