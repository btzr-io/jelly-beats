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
  currentPlaylist: {
    name: null,
    index: 0,
    totalTracks: 0,
    skippedTracks: 0,
  },
}

initialState.tooltip = {
  text: '',
  show: false,
  position: { left: 0, top: 0 },
}

initialState.cache = {}

initialState.playlist = {}

initialState.history = {
  stack: [],
  forward: [],
}

initialState.collections = {
  favorites: [],
  downloads: {},
}

initialState.latestBlock = 0

export default initialState
