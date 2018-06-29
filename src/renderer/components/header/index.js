import React from 'react'
import Progress from './view'
import { connect } from 'react-redux'

const select = (state, props) => ({
  // defaultState: ...
})

const perform = dispatch => ({
  // ActionName: params => dispatch(Action(params))
})

export default connect(state => state)(Progress)
