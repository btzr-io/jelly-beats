export default {
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
}
