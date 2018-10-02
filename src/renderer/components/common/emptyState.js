import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'

class EmptyState extends React.Component {
  render() {
    const { icon, title, message } = this.props
    return (
      <div className="empty-state">
        {icon && <Icon className="empty-state__icon icon" path={icon} />}
        {title && <div className="empty-state__title">{title}</div>}
        {message && <div className="empty-state__message">{message}</div>}
      </div>
    )
  }
}

export default EmptyState
