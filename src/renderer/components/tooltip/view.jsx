import React from 'react'
import classnames from 'classnames'

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
        className={classnames('tooltip', `tooltip-${placement}`, { show })}
        style={tooltipStyle}
      >
        {text}
      </div>
    )
  }
}

export default Tooltip
