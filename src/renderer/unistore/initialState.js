const initialState = {}

initialState.account = {
  currentChannel: {
    name: 'Anonymous',
    author: '',
    thumbnail: 'url',
  },
  channels: [],
}

initialState.navigation = {
  currentPage: '',
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
  position: { left: 0, top: 0 },
}

initialState.cache = {}

initialState.history = {
  stack: [],
  forward: [],
}

initialState.favorites = []

initialState.downloads = {}

initialState.latestBlock = 0

export default initialState
