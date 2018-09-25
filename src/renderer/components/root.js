import React from 'react'
import PropTypes from 'prop-types'
import { Provider, connect } from 'unistore/react'
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
