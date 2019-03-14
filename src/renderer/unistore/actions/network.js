import Lbry from '@/apis/lbry'
import * as StatusCode from '@/constants/statusCodes'

const CONNECTION_TIME_OUT = 2500

export default function(store) {
  const actions = {
    checkNetworkConnection(state) {
      const { connection } = state.network

      Lbry.status()
        .then(status => {
          const { connection_status: connectionStatus, is_running: isReady } = status
          const isConnecting = connectionStatus.code === StatusCode.CONNECTED && !isReady
          // Update network status
          // SDK is now running
          if (isReady) {
            // SDK is ready to use
            store.action(actions.updateNetworkConnection)(connectionStatus, isReady)
          } else {
            // New network status
            const connectingStatus = {
              code: StatusCode.CONNECTING,
              message: 'Loading components...',
            }
            // Check if needs an update
            if (
              connectionStatus.code !== connection.code &&
              connectingStatus.code !== connetion.code
            ) {
              store.action(actions.updateNetworkConnection)(
                isConnecting ? connectingStatus : connectionStatus,
                isReady
              )
            }
          }
          // Retry connection
          setTimeout(() => {
            store.action(actions.checkNetworkConnection)()
          }, CONNECTION_TIME_OUT)
        })
        .catch(error => {
          if (connection.code !== StatusCode.DISCONNECTED) {
            store.action(actions.handleNetworkError)()
          }
          // Retry connection
          setTimeout(() => {
            store.action(actions.checkNetworkConnection)()
          }, CONNECTION_TIME_OUT)
        })
    },

    updateNetworkConnection(state, connection, isReady) {
      const { network } = state
      return {
        network: {
          ...network,
          isReady,
          connection: { ...network.connection, ...connection },
        },
      }
    },

    handleNetworkError(state) {
      store.action(actions.updateNetworkConnection)(
        {
          code: StatusCode.DISCONNECTED,
          message: 'The LBRY daemon (lbrynet) is not running',
        },
        false
      )
    },
  }

  return actions
}
