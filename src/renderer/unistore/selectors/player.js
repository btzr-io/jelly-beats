export const selectPlaylistQueue = ({ collections, playlists }, uri) => {
  let playlist = []
  let collection = collections[uri]
  const isArray = Array.isArray(collection)

  if (collection && !isArray) {
    playlist = Object.keys(collection)
  } else if (collection && isArray) {
    playlist = collection
  } else if (playlists[uri]) {
    playlist = playlists[uri].list
  }
  return playlist
}

export const selectPlaylistByUri = ({ playlists }, uri) => {
  return playlists[uri]
}
