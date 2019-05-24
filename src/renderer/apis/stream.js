// Api endpoint
const APIS = {
  SPEECH: 'https://spee.ch',
  LBRY_TV: 'https://api.lbry.tv/content/claims',
  SOUNDBYTEZ: 'https://soundbytez.io',
}

// Generate file url (OLD)
export const getStreamUrlLegacy = (api, channelName, channelId, name) =>
  `${api}/${channelName}:${channelId}/${name}.audio`

export const getStreamUrl = (api, name, id) => `${api}/${name}/${id}/stream.mp4`

export const createStreamUrl = (name, id) => ({
  url: getStreamUrl(APIS.LBRY_TV, name, id),
})
