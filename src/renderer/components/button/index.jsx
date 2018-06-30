import React from 'react'
import css from '@root/css/modules/button.css.module'

import { Lbry } from 'lbry-redux'

class Button extends React.Component {
  render() {
    const { label, onClick } = this.props
    return (
      <button className={css.button} onClick={onClick}>
        {label}
      </button>
    )
  }
}

export default Button
