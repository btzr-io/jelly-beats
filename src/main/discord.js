import { ipcMain } from 'electron'
import discordRPC from 'discord-rich-presence'

// Discord client_id / app_id
const DISCORD_APP_ID = '462706392877236247'

// Discord rich presence client
const client = discordRPC(DISCORD_APP_ID)

const discordClient = () => {
  // This event is called each time the user plays track
  ipcMain.on('update-discord-presence', (event, args) => {
    const { title, artist, duration, currentTime } = args

    // Update discord rich presence data
    client.updatePresence({
      state: artist.channelName,
      details: `♪ ${title}`,
      startTimestamp: Date.now() + currentTime * 1000,
      endTimestamp: Date.now() + duration * 1000,
      largeImageKey: 'jelly-beats-icon',
      // smallImageKey: '',
      instance: true,
    })
  })

  return client
}

export default discordClient
