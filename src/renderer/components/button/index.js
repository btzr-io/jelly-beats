import React from 'react'
import { connect } from 'unistore/react'
import Button from './view'

export default connect(
  null,
  {
    hideTooltip: 'hideTooltip',
    showTooltip: 'showTooltip',
  }
)(Button)
