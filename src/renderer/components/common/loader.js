import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'

class Loader extends React.PureComponent {
  render() {
    const { icon, message, animation } = this.props

    const iconClass = classnames('icon', 'loader__icon', {
      [`animated--${animation}`]: animation,
    })

    return (
      <div className="loader">
        {icon && <Icon className={iconClass} path={icon} />}
        {message && <div className="loader__message">{message}</div>}
      </div>
    )
  }
}

export default Loader
