import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'
// import bemClass from '@/utils/classnames'

class Button extends React.Component {
  static defaultProps = {
    type: 'normal',
    size: 'normal',
  }

  render() {
    const { type, icon, size, label, onClick } = this.props

    const iconSizes = {
      small: 0.85,
      large: 1.2,
      normal: 1,
    }

    const buttonClass = classnames('button', `button--${type}`)

    const buttonIcon = icon ? (
      <div className={'button_icon'}>
        <Icon path={icon} color={'#FFFFFF'} size={iconSizes[size]} />
      </div>
    ) : null

    return (
      <button className={buttonClass} onClick={onClick}>
        {buttonIcon}
        {label && <span className={'button_label'}>{label}</span>}
      </button>
    )
  }
}

export default Button
