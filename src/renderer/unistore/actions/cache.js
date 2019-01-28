export default {
  storeTrack(state, uri, { claimData, channelData }) {
    const { favorites } = state.collections
    const { txid, nout, value } = claimData

    // Extract metadata
    const metadata = value.stream.metadata
    const { fee, name, title, author, thumbnail, description } = metadata

    // Generate claim outpoint
    const outpoint = `${txid}:${nout}`

    // Channel
    const artist = {
      channelUri: null,
      channelName: author,
    }

    // Get creator
    if (channelData) {
      artist.channelUri = channelData.permanent_url
      artist.channelName = channelData.name
    }

    // Check if claim is marked as favorite
    const isFavorite = uri && favorites && favorites.indexOf(uri) > -1

    // Previous data from cache
    const prevTrack = state.cache[uri] || {}

    const defaultPalette = {
      dark: 'var(--card-alt-bg-color)',
      vibrant: 'var(--color-primary)',
    }

    // New track data
    const track = {
      fee,
      uri,
      // Fallback for track title
      artist,
      outpoint,
      thumbnail,
      description,
      title: title || name,
      palette: prevTrack.palette || defaultPalette,
    }

    // Update cache
    return {
      cache: { ...state.cache, [uri]: { ...prevTrack, ...track } },
    }
  },

  storePalette(state, uri, palette) {
    const claim = state.cache[uri]
    if (claim) {
      // Update cache
      return {
        cache: { ...state.cache, [uri]: { ...claim, palette } },
      }
    }
  },

  storePlaylist(state, uri, { name, list }) {
    return {
      playlists: { ...state.playlists, [uri]: { name, list } },
    }
  },

  storeChannel(state, { id, uri, name, nickname, tags, outpoint, thumbnail, block }) {
    // Previous data from cache
    const prevChannel = state.cache[uri] || {}

    // New channel data
    const channel = {
      id,
      uri,
      tags,
      name,
      block,
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
