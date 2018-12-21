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

  storeChannel(state, uri, { name, nickname, tags, date, outpoint, thumbnail }) {
    // Previous data from cache
    const prevChannel = state.cache[uri] || {}
    // New channel data
    const channel = {
      uri,
      tags,
      date,
      name,
      nickname,
      outpoint,
      thumbnail,
    }
    // Update cache
    return {
      cache: { ...state.cache, [uri]: { ...channel } },
    }
  },
}
