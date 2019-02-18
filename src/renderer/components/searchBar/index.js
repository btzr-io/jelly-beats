import React from 'react'
import { connect } from 'unistore/react'
import SearchBar from './view'

export default connect(
  'navigation',
  {
    doNavigate: 'doNavigate',
    doNavigateBackward: 'doNavigateBackward',
    updateSearchQuery: 'updateSearchQuery',
  }
)(SearchBar)
