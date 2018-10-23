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

  handleMouseEnter = () => {
    const { tooltip, showTooltip } = this.props
    // Get target position
    const button = this.buttonElement.current
    const target = button.getBoundingClientRect()
    // Get parent position
    const container = document.getElementById('view')
    const parent = container.getBoundingClientRect()
    // Get scroll data
    const scroll = {
      top: container.scrollTop,
      left: container.scrollLeft,
    }
    // Create and show tooltip
    showTooltip({ target, parent, scroll, ...tooltip })
  }

  handleMouseLeave = () => {
    const { hideTooltip } = this.props
    hideTooltip()
  }

  handleClick = () => {
    const { tooltip, hideTooltip, onClick } = this.props
    onClick()
    tooltip && hideTooltip()
  }

  toggleEventListeners(type) {
    const button = this.buttonElement.current
    const action = `${type}EventListener`
    button[action]('mouseenter', this.handleMouseEnter)
    button[action]('mouseleave', this.handleMouseLeave)
  }

  componentDidMount() {
    const { tooltip } = this.props

    if (tooltip && tooltip.text) {
      this.toggleEventListeners('add')
    }
  }

  componentWillUnmount() {
    const { tooltip } = this.props
    tooltip && this.toggleEventListeners('remove')
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
        ref={this.buttonElement}
      >
        {icon && <Icon path={icon} className={iconClass} color={iconColor} />}
        {label && <span className={'button_label'}>{label}</span>}
      </button>
    )
  }
}

export default Button
