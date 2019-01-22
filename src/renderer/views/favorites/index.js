import { connect } from 'unistore/react'
import View from './view'

export default connect(
  (state, props) => {
    const { player, collections } = state
    const { favorites } = collections || {}
    return { player, favorites }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
  }
)(View)
