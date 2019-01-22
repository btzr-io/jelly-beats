import { connect } from 'unistore/react'
import View from './view'

export default connect((state, props) => {
  const { downloads } = state.collections || {}
  return { downloads }
})(View)
