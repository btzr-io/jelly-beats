import Lbry from '@/utils/lbry'

export default function(store) {
  const actions = {
    checkNetworkConnection(state) {
      const { connection } = state.network

      Lbry.status()
        .then(status => {
          const { connection_status: connectionStatus, is_running: isReady } = status
          const isConnecting = connectionStatus.code === 'connected' && !isReady
          // Update network status
          // SDK is now running
          if (isReady) {
            // Update network status
            store.action(actions.updateNetworkConnection)(connectionStatus, isReady)
          } else {
            const connectingStatus = {
              code: 'connecting',
              message: 'Loading components...',
            }
            store.action(actions.updateNetworkConnection)(
              isConnecting ? connectingStatus : connectionStatus,
              isReady
            )
          }
          // Retry connection
          setTimeout(() => {
            store.action(actions.checkNetworkConnection)()
          }, 2500)
        })
        .catch(error => {
          store.action(actions.handleNetworkError)()
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
          code: 'disconnected',
          message: 'The LBRY daemon (lbrynet) is not running',
        },
        false
      )
    },
  }

  return actions
}
