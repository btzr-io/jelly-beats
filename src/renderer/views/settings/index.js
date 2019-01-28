import { connect } from 'unistore/react'
import View from './view'

export default connect(
  (state, props) => {
    const { settings } = state
    return { settings }
  },
  {
    updateSettings: 'updateSettings',
  }
)(View)
