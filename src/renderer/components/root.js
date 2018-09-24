import React from 'react'
import PropTypes from 'prop-types'
import { connect, Provider } from 'react-redux'
import store from '@/store'
import App from '@/components/app'

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

Root.propTypes = {
  //store: PropTypes.object.isRequired,
  //page: PropTypes.func,
}

export default Root
