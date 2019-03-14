import { connect } from 'unistore/react'
import View from './view'

export default connect(
  'podcasts',
  {
    doNavigate: 'doNavigate',
    storeChannel: 'storeChannel',
  }
)(View)
