import { connect } from 'preact-redux'
import SplashScreen from './view'

const select = (state, props) => ({
  // defaultState: ...
})

const perform = dispatch => ({
  // ActionName: params => dispatch(Action(params))
})

export default connect(state => state)(SplashScreen)
