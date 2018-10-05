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

  setTrack(state, { uri, title, artist, thumbnail }) {
    const player = Object.assign({}, state.player)
    // Update track
    player.currentTrack = {
      uri,
      title,
      artist,
      thumbnail,
    }
    return { player }
  },
}))

export default store
