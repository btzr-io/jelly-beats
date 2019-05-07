import React from 'react'
import clsx from 'clsx'

class Tooltip extends React.PureComponent {
  static defaultProps = {
    tooltip: {
      show: false,
      placement: 'top',
    },
  }

  render() {
    const { tooltip } = this.props
    const { show, text, position, placement } = tooltip

    const tooltipStyle = {
      ...position,
    }

    return (
      <div
        className={clsx('tooltip', `tooltip-${placement}`, { show })}
        style={tooltipStyle}
      >
        {text}
      </div>
    )
  }
}

export default Tooltip
