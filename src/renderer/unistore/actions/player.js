import Lbry from '@/utils/lbry'
import { selectCalimByUri } from '@/unistore/selectors/cache'
import { selectPlaylistByName } from '@/unistore/selectors/player'

const DOWNLOAD_TIMEOUT = 20
const DOWNLOAD_POLL_INTERVAL = 250

export default function(store) {
  // Utils
  const getCodec = name => {
    var extname = path.extname(name).toLowerCase()
    return {
      '.m4a': 'audio/mp4; codecs="mp4a.40.5"',
      '.mp3': 'audio/mpeg',
    }[extname]
  }

  // Actions to register
  const streamActions = {
    updateStreamInfo(state, uri, streamInfo) {
      return {
        collections: {
          ...state.collections,
          downloads: {
            ...state.collections.downloads,
            [uri]: { ...state.collections.downloads[uri], ...streamInfo },
          },
        },
      }
    },

    handleStreamError(state, uri) {
      console.error(
        `Failed to download ${uri}, please try again. If this problem persists, visit https://lbry.io/faq/support for support.`
      )
      // Dispatch updateTrackStatus action
      store.action(streamActions.updateStreamInfo)(uri, {
        completed: false,
        isAvailable: false,
        isDownloading: false,
      })
    },

    updateLoadStatus(state, uri, outpoint) {
      Lbry.file_list({ outpoint, full_status: true }).then(([fileInfo]) => {
        // Get stream relevant data
        const streamInfo = {
          path: fileInfo.download_path,
          name: fileInfo.file_name,
          mimeType: fileInfo.mime_type,
          completed: fileInfo.completed,
        }

        // Download completed:
        if (fileInfo && fileInfo.completed) {
          // Debug
          console.info('Download completed!')

          // Jump progress to 100%
          streamInfo.progress = 100

          // Update stream info
          store.action(streamActions.updateStreamInfo)(uri, {
            ...streamInfo,
            // Update status
            completed: true,
            isAvailable: true,
            isDownloading: false,
          })
        }
        // Downloading..
        else if (fileInfo) {
          // Debug
          console.info('Downloaing!')

          // Update progress
          streamInfo.progress = (fileInfo.written_bytes / fileInfo.total_bytes) * 100
          // Update stream info
          store.action(streamActions.updateStreamInfo)(uri, {
            ...streamInfo,
            // Update status
            completed: false,
            isAvailable: true,
            isDownloading: true,
          })

          // Next update
          setTimeout(() => {
            actions.updateLoadStatus(state, uri, outpoint)
          }, DOWNLOAD_POLL_INTERVAL)
        }
      })
    },

    loadSource(state, uri, outpoint) {
      // Debug
      console.info('Downloading start!')

      // Start download
      store.action(streamActions.updateStreamInfo)(uri, {
        completed: false,
        isDownloading: true,
      })

      Lbry.get({ uri, timeout: DOWNLOAD_TIMEOUT })
        .then(streamInfo => {
          const timeout = !streamInfo || streamInfo.error === 'Timeout'
          timeout
            ? actions.handleStreamError(state, uri)
            : actions.purchase(state, uri, streamInfo.outpoint)
        })
        .catch(() => {
          actions.handleStreamError(state, uri)
        })
    },

    purchase(state, uri, outpoint) {
      //...
      const claim = selectCalimByUri(state, uri)
      const claimOutpoint = outpoint || (claim && claim.outpoint)

      // Claim missing from cache
      if (!claim || !claimOutpoint) return state

      Lbry.file_list({ outpoint: claimOutpoint, full_status: true }).then(
        ([fileInfo]) => {
          // We already fully downloaded the file.
          if (fileInfo && fileInfo.completed) {
            // Reconstruct file:
            // If written_bytes is false that means the user has deleted/moved the
            // file manually on their file system, so we need to dispatch a
            // do loadSource action to reconstruct the file from the blobs
            if (!fileInfo.written_bytes) {
              store.action(streamActions.loadSource)(uri, claimOutpoint)
            }
            // Success!
            else {
              // Update downloads
              console.info(claim.fee)
              store.action(streamActions.updateLoadStatus)(uri, claimOutpoint)
            }
          }
          // Downlading
          else if (fileInfo) {
            store.action(streamActions.updateLoadStatus)(uri, claimOutpoint)
          }
          // No download yet
          else if (!fileInfo) {
            // Todo add flag to protect purchase
            store.action(streamActions.loadSource)(uri, claimOutpoint)
          }
        }
      )
    },
  }

  const playerActions = {
    setTrack(state, uri, playlist) {
      // Select track
      store.setState({
        player: {
          ...state.player,
          currentTrack: state.cache[uri],
        },
      })

      // Update playlist
      playlist && store.action(playerActions.setPlaylist)(playlist)
    },

    setPlaylist(state, { name, index }) {
      const playlist = state.player.currentPlaylist

      // Only update data if is necessary
      if (name != playlist.name) {
        return {
          player: {
            ...state.player,
            currentPlaylist: { ...playlist, name, index: index || 0 },
          },
        }
      } else if (index && index != playlist.index) {
        playlist && store.action(playerActions.setPlaylistIndex)(index)
      }
    },

    setPlaylistIndex(state, index) {
      // Only set playlist once
      return {
        player: {
          ...state.player,
          currentPlaylist: { ...state.player.currentPlaylist, index },
        },
      }
    },

    updatePlayerStatus(state, status) {
      return {
        player: {
          ...state.player,
          ...status,
        },
      }
    },

    triggerAttempPlay(state, uri, playlist) {
      const { cache, player, collections } = state

      //Get player status
      const { paused, isLoading, currentTrack } = player || {}

      // Get claim data
      const claim = uri && cache[uri]

      //Get stream status
      const { isAvailable, isDownloading } = collections.downloads[uri] || {}
      const shouldTogglePlay = currentTrack ? currentTrack.uri === uri : false

      if (shouldTogglePlay) {
        // Try to play content
        if (!isDownloading && !isLoading) {
          store.action(playerActions.triggerTogglePlay)()
          playlist && store.action(playerActions.setPlaylistIndex)(playlist.index)
        }
      } else if (claim && !claim.fee) {
        // Try to purchase and download free content
        store.action(playerActions.setTrack)(uri)
        store.action(streamActions.purchase)(uri)
        playlist && store.action(playerActions.setPlaylistIndex)(playlist.index)
      }
    },

    triggerPlay(state) {
      store.action(playerActions.updatePlayerStatus)({ syncPaused: false })
    },

    triggerPlayNext(state) {
      const { cache, player } = state
      const { currentPlaylist } = player
      const { name, index, skippedTracks } = currentPlaylist
      const next = index + 1
      const tracks = selectPlaylistByName(state, name)

      // Last track is current index
      if (!tracks || next > tracks.length) return

      // Get claim uri
      const uri = tracks[next]

      // Skip track:
      // if there is no source to play
      if (!uri || !state.collections.downloads[uri] || next === tracks.length) {
        if (cache[uri] && !cache[uri].fee) {
          store.action(playerActions.triggerAttempPlay)(uri, { name, index: next })
        } else {
          store.action(playerActions.triggerSkipNextTrack)()
        }
      } else {
        if (skippedTracks > 0) {
          // TODO: Notify user
          console.info('skipped-tracks:', skippedTracks)
        }

        // Update playlist index
        return {
          player: {
            ...state.player,
            currentTrack: state.cache[uri],
            currentPlaylist: {
              ...currentPlaylist,
              index: next,
              skippedTracks: 0,
            },
          },
        }
      }
    },

    triggerPlayPrevious(state) {
      const { cache, player } = state
      const { currentPlaylist } = player
      const { name, index, skippedTracks } = currentPlaylist
      const prev = index - 1

      const tracks = selectPlaylistByName(state, name)

      // Last track is current index
      if (!tracks || prev < -1) return state

      // Get claim uri
      const uri = tracks[prev]

      // Skip track:
      // if there is no source to play
      if (!uri || !state.collections.downloads[uri] || prev === -1) {
        if (cache[uri] && !cache[uri].fee) {
          store.action(playerActions.triggerAttempPlay)(uri, { name, index: prev })
        } else {
          store.action(playerActions.triggerSkipPreviousTrack)()
        }
      } else {
        if (skippedTracks > 0) {
          // TODO: Notify user
          console.info('skipped-tracks:', skippedTracks)
        }

        // Update playlist index
        return {
          player: {
            ...state.player,
            currentTrack: state.cache[uri],
            currentPlaylist: {
              ...currentPlaylist,
              index: prev,
              skippedTracks: 0,
            },
          },
        }
      }
    },

    triggerPause(state) {
      store.action(playerActions.updatePlayerStatus)({ syncPaused: true })
    },

    triggerTogglePlay(state) {
      store.action(playerActions.updatePlayerStatus)({
        syncPaused: !state.player.syncPaused,
      })
    },

    triggerSkipTrack(state, steeps, limit) {
      const { currentPlaylist } = state.player
      const { name, index, skippedTracks } = currentPlaylist
      const jump = index + steeps
      const direction = steeps > 0 ? 'Next' : 'Previous'

      const tracks = selectPlaylistByName(state, name)

      if (jump === limit) {
        // TODO: Notify user
        console.info('skipped-tracks:', skippedTracks)
        return {
          player: {
            ...state.player,
            currentPlaylist: {
              ...currentPlaylist,
              index: index - steeps * skippedTracks,
              skippedTracks: 0,
            },
          },
        }
      } else {
        store.setState({
          player: {
            ...state.player,
            currentPlaylist: { ...currentPlaylist, skippedTracks: skippedTracks + 1 },
          },
        })
        store.action(playerActions.setPlaylistIndex)(jump)
        store.action(playerActions[`triggerPlay${direction}`])()
      }
    },

    triggerSkipNextTrack(state) {
      const { currentPlaylist } = state.player
      const tracks = selectPlaylistByName(state, currentPlaylist.name)
      store.action(playerActions.triggerSkipTrack)(1, tracks.length)
    },

    triggerSkipPreviousTrack(state) {
      store.action(playerActions.triggerSkipTrack)(-1, 0)
    },
  }

  return { ...playerActions, ...streamActions }
}
