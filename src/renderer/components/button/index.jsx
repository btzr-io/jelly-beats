import React from 'react'
import css from '@/css/modules/button.css.module'
import Icon from '@/components/common/icon'

class Button extends React.Component {
  render() {
    const { label, icon, onClick } = this.props
    return (
      <button className={css.button} onClick={onClick}>
        {icon && <Icon className={css.icon} size={'sm'} icon={icon} />}
        {label}
      </button>
    )
  }
}

export default Button
