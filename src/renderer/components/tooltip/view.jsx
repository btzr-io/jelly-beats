import React from 'react'

class Tooltip extends React.PureComponent {
  render() {
    const { text, placement = 'top', children } = this.props

    return (
      <div className="tooltip">
        <span className={`tooltip-text tooltip-${placement}`}>{text}</span>
        {children}
      </div>
    )
  }
}

export default Tooltip
