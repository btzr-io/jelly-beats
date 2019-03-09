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
      artist.channelId = channelData.claim_id
      artist.channelUri = channelData.permanent_url
      artist.channelName = channelData.name
    }

    const { favorites } = state.collections
    const isFavorite = uri && favorites && favorites.indexOf(uri) > -1

    const defaultTitle = title || name

    // Format title
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
      formatedTitle,
      formatedArtist,
      title: formatedTitle || defaultTitle,
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

  storeChannel(state, channelData) {
    const {
      name,
      nout,
      txid,
      height: block,
      claim_id: id,
      permanent_url: uri,
    } = channelData

    // Generate claim outpoint
    const outpoint = `${txid}:${nout}`

    const prevChannel = state.cache[uri] || {}

    // Prevent update
    if (outpoint === prevChannel.outpoint) {
      return null
    }

    // Default channel data
    const channel = {
      id,
      uri,
      block,
      outpoint,
      name: name.substring(1),
      nickname: name,
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Cubozoa.jpg',
    }

    // Update cache
    return {
      cache: { ...state.cache, [uri]: { ...channel } },
    }
  },
}
