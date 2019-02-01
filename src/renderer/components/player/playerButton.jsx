import React from 'react'
import Button from '@/components/button'

class PlayerButton extends React.Component {
  static defaultProps = {
    size: 'large',
    type: 'action',
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {
      type,
      icon,
      size,
      toggle,
      action,
      disabled,
      iconColor,
      animation,
    } = this.props

    return (
      <Button
        type={`player-${type}`}
        icon={icon}
        toggle={toggle}
        iconColor={iconColor}
        size={size}
        onClick={action}
        disabled={disabled}
        animation={animation}
      />
    )
  }
}

export default PlayerButton
