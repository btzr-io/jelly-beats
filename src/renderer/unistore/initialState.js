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

initialState.cache = {}

initialState.favorites = []

initialState.downloads = {}

export default initialState
