import React from 'react'
import css from '@root/css/modules/button.css.module'

import { Lbry } from 'lbry-redux'

class Button extends React.Component {
  render() {
    const { label } = this.props
    return <button className={css.button}>{label}</button>
  }
}

export default Button
