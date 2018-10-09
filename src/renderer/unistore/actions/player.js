export default function(store) {
  const actions = {
    setTrack(state, uri) {
      return {
        player: {
          ...state.player,
          currentTrack: state.cache[uri],
        },
      }
    },

    updatePlayerStatus(state, status) {
      return {
        player: {
          ...state.player,
          ...status,
        },
      }
    },

    triggerPlay(state) {
      store.action(actions.updatePlayerStatus)({ syncPaused: false })
    },

    triggerPause(state) {
      store.action(actions.updatePlayerStatus)({ syncPaused: true })
    },

    triggerTogglePlay(state) {
      store.action(actions.updatePlayerStatus)({ syncPaused: !state.player.syncPaused })
    },
  }

  return actions
}
