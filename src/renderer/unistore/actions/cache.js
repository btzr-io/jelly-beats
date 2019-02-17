import getArtistTitle from 'get-artist-title'

export default {
  storeTrack(state, uri, { claimData, channelData }) {
    const { txid, nout, value } = claimData

    // Generate claim outpoint
    const outpoint = `${txid}:${nout}`

    // Previous data from cache
    const prevTrack = state.cache[uri] || {}

    // Prevent update
    if (outpoint === prevTrack.outpoint) {
      return null
    }

    // Extract metadata
    const metadata = value.stream.metadata
    const { fee, name, title, author, thumbnail, description } = metadata

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

    const { favorites } = state.collections
    const isFavorite = uri && favorites && favorites.indexOf(uri) > -1

    // Format title
    const defaultTitle = title || name

    const [formatedArtist, formatedTitle] = getArtistTitle(defaultTitle, {
      defaultTitle,
      defaultArtist: artist.channelName,
    })

    // New track data
    const track = {
      fee,
      uri,
      // Fallback for track title
      artist,
      outpoint,
      thumbnail,
      description,
      title: formatedTitle,
    }

    // Update cache
    return {
      cache: { ...state.cache, [uri]: { ...prevTrack, ...track } },
    }
  },

  storePalette(state, uri, palette) {
    const claim = state.cache[uri]

    if (claim) {
      // Prevent update
      if (claim.palette) return null

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

    // Prevent update
    if (outpoint === prevChannel.outpoint) {
      return null
    }

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
