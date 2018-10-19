const initialState = {}

initialState.navigation = {
  stack: [],
  currentPage: '/',
  currentQuery: {},
}

initialState.player = {
  paused: true,
  isLoading: false,
  showPlayer: false,
  syncPaused: true,
  currentTrack: {},
}

initialState.cache = {}

initialState.favorites = []

initialState.downloads = {}

export default initialState
