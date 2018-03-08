import React from 'react'
import { connect } from 'react-redux'
import App from './view'

const select = (state, props) => ({
  // defaultState: ...
})

const perform = dispatch => ({
  // ActionName: params => dispatch(Action(params))
})

export default connect(select, perform)(App)
