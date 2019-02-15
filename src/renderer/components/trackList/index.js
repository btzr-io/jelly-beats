import React from 'react'
import TrackList from './view'
import { connect } from 'unistore/react'

export default connect(
  (state, props) => null,
  {
    doNavigate: 'doNavigate',
  }
)(TrackList)
