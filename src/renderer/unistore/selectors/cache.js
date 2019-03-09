export const selectCalimByUri = ({ cache }, uri) => cache[uri]

export const selectStreamByUri = ({ collections }, uri) =>
  collections.downloads.find(stream => stream.uri === uri)
