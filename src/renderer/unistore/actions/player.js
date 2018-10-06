export default {
  setTrack(state, uri) {
    console.info(state.cache[uri])
    return {
      player: {
        ...state.player,
        currentTrack: state.cache[uri],
      },
    }
  },
}
