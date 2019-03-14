import React from 'react'
import { connect } from 'unistore/react'
import Router from './view'

export default connect(
  'navigation',
  { doNavigate: 'doNavigate' }
)(Router)
