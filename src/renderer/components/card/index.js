import React from 'react'
import Progress from './view'
import { connect } from 'unistore/react'

export default connect(
  'cache, favorites, downloads',
  {
    purchase: 'purchase',
    setTrack: 'setTrack',
    storeTrack: 'storeTrack',
    doNavigate: 'doNavigate',
    addToFavorites: 'addToFavorites',
    removefromFavorites: 'removefromFavorites',
  }
)(Progress)
