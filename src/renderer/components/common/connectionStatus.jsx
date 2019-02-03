import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'
import * as icons from '@/constants/icons'

class ConnectionStatus extends React.PureComponent {
  static defaultProps = {
    connection: {},
  }

  static codes = {
    connected: {
      type: 'connected',
      icon: icons.READY,
      label: 'CONNECTED',
      color: 'green',
    },
    connecting: {
      type: 'connecting',
      icon: icons.SPINNER,
      label: 'CONNECTING',
    },
    disconnected: {
      type: 'disconnected',
      icon: icons.UKNOWN,
      label: 'DISCONNECTED',
    },
    network_connection: {
      type: 'network',
      icon: icons.WARNING,
      label: 'NETWORK ISSUES',
      color: 'yellow',
    },
  }

  render() {
    const { connection } = this.props

    const code = connection && ConnectionStatus.codes[connection.code]

    if (!code) return null

    const statusClass = classnames('connection-status', {
      [`connection-status--${code.type}`]: code.type,
    })

    const iconColor = code.color ? `var(--color-${code.color})` : 'var(--subtext-color)'

    return (
      <span className={statusClass}>
        <Icon
          path={code.icon}
          color={iconColor}
          className={classnames('icon', 'icon--normal', 'connection-status--icon', {
            'animated--spin': code.type === 'connecting',
          })}
        />
        <span className={'connection-status--label'}>{code.label}</span>
      </span>
    )
  }
}

export default ConnectionStatus
