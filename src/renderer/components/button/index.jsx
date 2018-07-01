import React from 'react'
import css from '@root/css/modules/button.css.module'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Lbry } from 'lbry-redux'
console.log(css.icon)
class Button extends React.Component {
  render() {
    const { label, icon, onClick } = this.props
    return (
      <button className={css.button} onClick={onClick}>
        {icon && <FontAwesomeIcon className={css.icon} size={'sm'} icon={['fas', icon]} />}
        {label}
      </button>
    )
  }
}

export default Button
