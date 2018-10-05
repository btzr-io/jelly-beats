import React from 'react'
import Icon from '@mdi/react'
import Button from './button'
import classnames from 'classnames'

class EmptyState extends React.PureComponent {
  render() {
    const { icon, title, message, action, actionLabel } = this.props
    return (
      <div className="empty-state">
        {icon && <Icon className="empty-state__icon icon" path={icon} />}
        {title && <div className="empty-state__title">{title}</div>}
        {message && <div className="empty-state__message">{message}</div>}
        {action && <Button type="empty-state" label={actionLabel} />}
      </div>
    )
  }
}

export default EmptyState
