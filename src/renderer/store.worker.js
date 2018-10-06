import createStore from 'stockroom/worker'
import initialState from '@/unistore/initialState'

let store = createStore({ ...initialState })

store.registerActions(store => ({
  doNavigate(state, path, query) {
    return {
      navigation: {
        currentPage: path,
        currentQuery: query || {},
      },
    }
  },

  addToFavorites(state, uri) {
    const favorites = Object.assign([], state.favorites)
    // Add to list
    const index = favorites.indexOf(uri)
    index < 0 && favorites.push(uri)
    return { favorites }
  },

  removefromFavorites(state, uri) {
    const favorites = Object.assign([], state.favorites)
    // Remove from list
    const index = favorites.indexOf(uri)
    index > -1 && favorites.splice(index, 1)
    return { favorites }
  },

  setTrack(state, uri) {
    console.info(state.cache[uri])
    return {
      player: {
        ...state.player,
        currentTrack: state.cache[uri],
      },
    }
  },

  storeTrack(state, uri, { title, artist, thumbnail, isAvailable }) {
    const track = {
      uri,
      title,
      artist,
      thumbnail,
      isAvailable,
    }
    const cache = state.cache[uri] || {}
    return {
      cache: { ...state.cache, [uri]: { ...track, ...cache } },
    }
  },

  updateTrackStatus(state, uri, availibity) {
    return {
      cache: {
        ...state.cache,
        // Select from cache
        [uri]: {
          ...state.cache[uri],
          isAvailable: availibity,
        },
      },
    }
  },
}))

export default store
