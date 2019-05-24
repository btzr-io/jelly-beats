import getArtistTitle from 'get-artist-title'

export default {
  storeTrack(state, uri, { claimData, channelData }) {
    const { txid, nout, value, name, claim_id: id } = claimData

    // Generate claim outpoint
    const outpoint = `${txid}:${nout}`

    // Previous data from cache
    const prevTrack = state.cache[uri] || {}

    // Prevent update
    if (outpoint === prevTrack.outpoint) {
      return null
    }

    // Extract metadata
    const metadata = value
    const { fee, audio, title, author, thumbnail, description } = metadata

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

    let duration = null

    if (audio) {
      duration = audio.duration
    }

    // New track data
    const track = {
      id,
      fee,
      uri,
      name,
      artist,
      outpoint,
      thumbnail: thumbnail ? thumbnail.url || null : null,
      title: defaultTitle,
      duration,
      description,
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
      value,
      height: block,
      claim_id: id,
      permanent_url: uri,
    } = channelData

    const { thumbnail } = value

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

    if (thumbnail && thumbnail.url) {
      channel.thumbnail = thumbnail.url
    }

    // Update cache
    return {
      cache: { ...state.cache, [uri]: { ...channel } },
    }
  },
}
