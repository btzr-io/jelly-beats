export const selectPlaylistStack = ({ collections, playlists }, uri) => {
  let playlist = []
  let collection = collections[uri]

  // Transform object to array
  if (collection && !Array.isArray(collection)) {
    playlist = Object.keys(collection)
  } else {
    playlist = playlists[uri] && playlists[uri].list
  }

  return playlist
}

export const selectPlaylistByUri = ({ playlists }, uri) => {
  return playlists[uri]
}
