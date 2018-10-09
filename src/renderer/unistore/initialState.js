const initialState = {}

initialState.navigation = {
  stack: [],
  currentPage: '/',
  currentQuery: {},
}

initialState.player = {
  paused: null,
  loading: null,
  currentTrack: {},
}

initialState.cache = {}

initialState.favorites = []

initialState.downloads = {}

export default initialState
