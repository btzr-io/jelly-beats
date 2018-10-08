import React from 'react'
import classnames from 'classnames'

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
    const statusClass = classnames('status', { [`status--${health}`]: health })

    return <span className={statusClass} />
  }
}

export default Health
