import React from 'react'
import clsx from 'clsx'

class Health extends React.PureComponent {
  static defaultProps = {
    status: {},
  }

  static getHealth = ({ completed, isAvailable, isDownloading }) => {
    if (isDownloading) return 'busy'
    if (isAvailable === false) return 'bad'
    if (isAvailable && completed) return 'good'
  }

  render() {
    const { status } = this.props
    const health = Health.getHealth(status)
    const statusClass = clsx('status', { [`status--${health}`]: health })

    return <span className={statusClass} />
  }
}

export default Health
