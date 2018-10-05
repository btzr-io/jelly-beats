const initialState = {}

initialState.navigation = {
  stack: [],
  currentPage: '/',
  currentQuery: {},
}

initialState.player = {
  isPlaying: false,
  currentTrack: {},
}

initialState.favorites = []

export default initialState
