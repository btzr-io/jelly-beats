const actions = {
  setTrack(state, uri) {
    return {
      player: {
        ...state.player,
        currentTrack: state.cache[uri],
      },
    }
  },
}

export default actions
