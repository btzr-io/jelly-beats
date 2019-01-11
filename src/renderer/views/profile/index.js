import { connect } from 'unistore/react'
import View from './view'

export default connect(
  'favorites, cache',
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
  }
)(View)
