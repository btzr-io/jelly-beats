import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'

class Button extends React.Component {
  static defaultProps = {
    type: 'normal',
    size: 'normal',
  }

  render() {
    const { type, icon, size, label, disabled, onClick } = this.props

    const iconSizes = {
      small: 0.85,
      large: 1.2,
      normal: 1,
    }

    const buttonClass = classnames('button', `button--${type}`)

    return (
      <button className={buttonClass} onClick={onClick} disabled={disabled}>
        {icon && (
          <div className="button_icon">
            <Icon path={icon} size={iconSizes[size]} className="icon" />
          </div>
        )}
        {label && <span className={'button_label'}>{label}</span>}
      </button>
    )
  }
}

export default Button
