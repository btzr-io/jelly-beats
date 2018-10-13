export default {
  storeTrack(state, uri, { fee, title, artist, outpoint, thumbnail }) {
    // Previous data from cache
    const prevTrack = state.cache[uri] || {}
    // New track data
    const track = {
      fee,
      uri,
      title,
      artist,
      outpoint,
      thumbnail,
    }
    // Update cache
    return {
      cache: { ...state.cache, [uri]: { ...track } },
    }
  },
}
