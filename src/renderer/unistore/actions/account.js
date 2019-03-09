import Lbry from '@/apis/lbry'

export default function(store) {
  const actions = {
    setCurrentChannel(state, uri) {
      const { currentChannel } = state.account
      const channel = state.cache[uri]

      if (channel) {
        const { uri, nickname, thumbnail } = channel
        return {
          account: {
            ...state.account,
            currentChannel: { ...currentChannel, uri, nickname, thumbnail },
          },
        }
      }
    },
  }
  return actions
}
