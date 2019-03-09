const speech = {}

// Api endpoint
speech.API = 'https://spee.ch'

// Generate file url
export const createStreamUrl = (channelName, channelId, title) => {
  ;`${speech.API}/${channelName}:${channelId}/${title}.mp3`
}
