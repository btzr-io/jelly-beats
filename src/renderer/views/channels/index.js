import { connect } from 'unistore/react'
import View from './view'

export default connect(
  (state, props) => {
    const { cache, account } = state
    const { currentChannel } = account || {}
    return { cache, currentChannel }
  },
  {
    setCurrentChannel: 'setCurrentChannel',
    doNavigate: 'doNavigate',
    storeChannel: 'storeChannel',
  }
)(View)
