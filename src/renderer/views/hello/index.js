import { connect } from 'react-redux'
import View from './view'

const select = (state, props) => ({
  // defaultState: ...
})

const perform = dispatch => ({
  // ActionName: params => dispatch(Action(params))
})

export default connect(state => state)(View)
