export default function(store) {
  const actions = {
    addToFavorites(state, uri) {
      const favorites = Object.assign([], state.collections.favorites)
      // Add to list
      const index = favorites.indexOf(uri)
      index < 0 && favorites.push(uri)
      return { collections: { ...state.collections, favorites } }
    },

    removefromFavorites(state, uri) {
      const favorites = Object.assign([], state.collections.favorites)
      // Remove from list
      const index = favorites.indexOf(uri)
      index > -1 && favorites.splice(index, 1)
      return { collections: { ...state.collections, favorites } }
    },

    removeBatchfromFavorites(state, uris) {
      const favorites = Object.assign([], state.collections.favorites)
      // Remove from list
      Object.keys(uris).map(uri => {
        const index = favorites.indexOf(uri)
        index > -1 && favorites.splice(index, 1)
      })
      return { collections: { ...state.collections, favorites } }
    },

    toggleFavorite(state, uri) {
      const favorites = state.collections.favorites || []
      // Favorite selector
      const isFavorite = favorites.indexOf(uri) > -1
      // Toggle favorite
      store.action(!isFavorite ? actions.addToFavorites : actions.removefromFavorites)(
        uri
      )
    },
  }

  return actions
}
