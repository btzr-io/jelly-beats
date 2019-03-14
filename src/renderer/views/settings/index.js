import { connect } from 'unistore/react'
import View from './view'

export default connect(
  (state, props) => {
    const { settings, network } = state
    return { settings, network }
  },
  {
    updateSettings: 'updateSettings',
    updateNetworkConnection: 'updateNetworkConnection',
  }
)(View)
