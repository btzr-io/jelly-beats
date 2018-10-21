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

initialState.tooltip = {
  text: '',
  show: false,
  position: null,
}

initialState.cache = {}

initialState.favorites = []

initialState.downloads = {}

export default initialState
