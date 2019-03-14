import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'
import * as icons from '@/constants/icons'

import * as StatusCode from '@/constants/statusCodes'

class ConnectionStatus extends React.PureComponent {
  static defaultProps = {
    connection: {},
  }

  static codes = {
    connected: {
      type: StatusCode.CONNECTED,
      icon: icons.READY,
      label: 'CONNECTED',
      color: 'green',
    },
    connecting: {
      type: StatusCode.CONNECTING,
      icon: icons.SPINNER,
      label: 'CONNECTING',
    },
    disconnected: {
      type: StatusCode.DISCONNECTED,
      icon: icons.UKNOWN,
      label: 'DISCONNECTED',
    },
    network_connection: {
      type: StatusCode.NETWORK_ISSUES,
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
