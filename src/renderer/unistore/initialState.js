import settings from './defaultSettings'
import { podcasts } from '@/apis/api'

// Store properties undefined on "first render" #14
// https://github.com/developit/stockroom/issues/14
const initialState = {
  ready: true,
  streams: {},
  podcasts,
  settings,
}

initialState.searchQuery = null

initialState.network = {
  isReady: false,
  connection: {},
}

initialState.navigation = {
  currentPage: '',
  currentQuery: {},
}

initialState.player = {
  error: null,
  showBanner: false,
  bannerMessage: null,
  paused: true,
  loading: false,
  showPlayer: false,
  syncPaused: true,
  currentTrack: {
    uri: null,
  },
  currentPlaylist: {
    uri: null,
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

initialState.playlists = {}

initialState.history = {
  stack: [],
  forward: [],
}

initialState.collections = {
  favorites: [],
  downloads: [],
}

initialState.latestBlock = 0

export default initialState
