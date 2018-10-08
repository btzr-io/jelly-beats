export default {
  storeTrack(state, uri, { fee, title, artist, outpoint, thumbnail }) {
    // Previous data from cache
    const prevTrack = state.cache[uri] || {}
    // Status
    const { completed, isPlaying, isAvailable, isDownloading } = prevTrack
    // New track data
    const track = {
      fee,
      uri,
      title,
      artist,
      outpoint,
      thumbnail,
      // Don't overwrite
      completed,
      isPlaying,
      isAvailable,
      isDownloading,
    }
    // Update cache
    return {
      cache: { ...state.cache, [uri]: { ...track } },
    }
  },

  updateTrackStatus(state, uri, { completed, isPlaying, isAvailable, isDownloading }) {
    const prevTrack = state.cache[uri]

    // Track doesn't exists
    if (!uri || !prevTrack) return state

    const status = {
      completed,
      isPlaying,
      isAvailable,
      isDownloading,
    }

    // Update cache
    return {
      cache: {
        ...state.cache,
        // Select from cache
        [uri]: {
          ...state.cache[uri],
          ...status,
        },
      },
    }
  },
}
