import React from 'react'
import { connect, Provider } from 'react-redux'
import PropTypes from 'prop-types'
import routes from '@root/routes'
import store from '@root/store'
import Router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlay,
  faPause,
  faStepForward,
  faStepBackward,
  faRandom,
  faHeadphones,
  faHeart,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faPlay,
  faPause,
  faStepForward,
  faStepBackward,
  faRandom,
  faHeadphones,
  faHeart,
  faEllipsisV
)

const Root = () => (
  <Provider store={store}>
    <Router routes={routes} defaultRoute={'/'} />
  </Provider>
)

Root.propTypes = {
  //store: PropTypes.object.isRequired,
  //page: PropTypes.func,
}

export default Root
