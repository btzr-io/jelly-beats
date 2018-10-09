import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'

class Button extends React.PureComponent {
  static defaultProps = {
    type: 'normal',
    size: 'normal',
    onClick: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      animated: false,
    }
  }

  render() {
    const {
      type,
      toggle,
      icon,
      iconColor,
      size,
      label,
      disabled,
      onClick,
      animation,
    } = this.props
    const { animated } = this.state

    const buttonClass = classnames('button', `button--${type}`, {
      'button--toggle': toggle,
      [`animated--${animation}`]: animation,
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
