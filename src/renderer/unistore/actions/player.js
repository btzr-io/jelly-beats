const actions = {
  setTrack(state, uri) {
    return {
      player: {
        ...state.player,
        currentTrack: state.cache[uri],
      },
    }
  },

  updatePlayerStatus(state, { paused, isLoading }) {
    const status = { paused, isLoading }
    return {
      player: {
        ...state.player,
        ...status,
      },
    }
  },
}

export default actions
