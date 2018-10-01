import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'

class Button extends React.Component {
  static defaultProps = {
    type: 'normal',
    size: 'normal',
  }

  render() {
    const { type, toggle, icon, iconColor, size, label, disabled, onClick } = this.props

    const buttonClass = classnames('button', `button--${type}`, {
      'button--active': toggle,
    })

    const iconClass = classnames('icon', 'button_icon', {
      [`icon--${size}`]: size !== 'normal',
    })

    return (
      <button className={buttonClass} onClick={onClick} disabled={disabled}>
        {icon && <Icon path={icon} className={iconClass} color={iconColor} />}
        {label && <span className={'button_label'}>{label}</span>}
      </button>
    )
  }
}

export default Button
