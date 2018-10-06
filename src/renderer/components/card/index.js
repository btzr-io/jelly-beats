import React from 'react'
import Progress from './view'
import { connect } from 'unistore/react'

export default connect(
  'cache, favorites',
  {
    play: 'setTrack',
    doNavigate: 'doNavigate',
    addToFavorites: 'addToFavorites',
    removefromFavorites: 'removefromFavorites',
    storeTrack: 'storeTrack',
  }
)(Progress)
