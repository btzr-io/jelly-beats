// Api endpoint
const APIS = {
  SPEECH: 'https://spee.ch',
  SOUNDBYTEZ: 'https://soundbytez.io',
}

// Generate file url
export const getStreamUrl = (api, channelName, channelId, name) =>
  `${api}/${channelName}:${channelId}/${name}.audio`

export const createStreamUrl = (channelName, channelId, name) => ({
  url: getStreamUrl(APIS.SPEECH, channelName, channelId, name),
  fallback: getStreamUrl(APIS.SOUNDBYTEZ, channelName, channelId, name),
})
