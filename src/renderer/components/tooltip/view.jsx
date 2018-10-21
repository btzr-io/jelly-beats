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
    const { show, text, placement } = tooltip
    return (
      <div className={classnames('tooltip', { show })}>
        <div className={`tooltip-text tooltip-${placement}`}>{text}</div>
      </div>
    )
  }
}

export default Tooltip
