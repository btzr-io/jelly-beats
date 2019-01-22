export const selectPlaylistByName = ({ collections }, name) => {
  let playlist = collections[name]

  // Transform object to array
  if (playlist && !Array.isArray(playlist)) {
    playlist = Object.keys(playlist)
  }

  return playlist
}
