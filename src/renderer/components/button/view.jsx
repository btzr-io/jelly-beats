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
    this.buttonElement = React.createRef()
  }

  handleMouseEnter = event => {
    const { showTooltip } = this.props
    const button = this.buttonElement.current
    const container = document.getElementById('view')

    const scroll = {
      top: container.scrollTop,
      left: container.scrollLeft,
      height: button.scrollHeight,
    }

    const target = button.getBoundingClientRect()
    const parent = container.getBoundingClientRect()

    showTooltip({ text: 'Help', target, parent, scroll, placement: 'top' })
  }

  handleMouseLeave = event => {
    const { hideTooltip } = this.props
    hideTooltip()
  }

  handleClick = () => {
    const { onClick, hideTooltip } = this.props
    onClick()
    hideTooltip()
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
      <button
        className={buttonClass}
        onClick={this.handleClick}
        disabled={disabled}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        ref={this.buttonElement}
      >
        {icon && <Icon path={icon} className={iconClass} color={iconColor} />}
        {label && <span className={'button_label'}>{label}</span>}
      </button>
    )
  }
}

export default Button
