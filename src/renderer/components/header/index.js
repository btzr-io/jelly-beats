import React from 'react'
import Header from './view'
import { connect } from 'unistore/react'

export default connect(
  null,
  { doNavigate: 'doNavigate' }
)(Header)
