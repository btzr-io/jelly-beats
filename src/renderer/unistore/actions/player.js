import Lbry from '@/utils/lbry'
import { selectCalimByUri } from '@/unistore/selectors/cache'
import { selectPlaylistStack } from '@/unistore/selectors/player'

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
        const streamInfo = fileInfo
          ? {
              path: fileInfo.download_path,
              name: fileInfo.file_name,
              mimeType: fileInfo.mime_type,
              completed: fileInfo.completed,
            }
          : {}

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
        // Download stopped ?
        else if (fileInfo && fileInfo.stopped) {
          store.action(streamActions.handleStreamError)(uri)
        }
        // Downlading...
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
            store.action(streamActions.updateLoadStatus)(uri, outpoint)
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
            ? store.action(streamActions.handleStreamError)(uri)
            : store.action(streamActions.purchase)(uri, streamInfo.outpoint)
        })
        .catch(() => {
          store.action(streamActions.handleStreamError)(uri)
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
              console.error(fileInfo)
              store.action(streamActions.loadSource)(uri, claimOutpoint)
            }
            // Success!
            else {
              // Update downloads
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

    setPlaylist(state, { uri, name, index }) {
      const playlist = state.player.currentPlaylist

      // Only update data if is necessary
      if (name != playlist.name || index != playlist.index) {
        return {
          player: {
            ...state.player,
            currentPlaylist: { ...playlist, uri, name, index },
          },
        }
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

    playlistNavigation(state, steeps) {
      const { cache, player, collections } = state
      const { downloads } = collections
      const { currentPlaylist } = player
      const { uri, name, index, skippedTracks } = currentPlaylist
      const jump = index + steeps
      const tracks = selectPlaylistStack(state, uri || name)
      const direction = steeps > 0 ? 'Next' : 'Previous'

      const limit = jump < tracks.length && jump > -1

      // Last track is current index
      if (tracks && limit) {
        // Get claim uri
        const uri = tracks[jump]
        const stream = downloads[uri]
        const isFree = cache[uri] && !cache[uri].fee

        const { isAvailable } = stream || {}

        const shouldAttempPurchase = (!uri || !stream) && isFree

        if (shouldAttempPurchase) {
          store.action(playerActions.triggerAttempPlay)(uri, { name, index: jump })
        } else if (!isAvailable || !isFree) {
          // Skip track if there is no source to play
          store.action(playerActions[`triggerSkip${direction}Track`])()
        } else {
          if (skippedTracks > 0) {
            // TODO: Notify user
            console.info('skipped-tracks:', skippedTracks)
          }

          // Update playlist index
          return {
            player: {
              ...state.player,
              currentTrack: cache[uri],
              currentPlaylist: {
                ...currentPlaylist,
                index: jump,
                skippedTracks: 0,
              },
            },
          }
        }
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
      const shouldTogglePlay =
        isAvailable && (currentTrack ? currentTrack.uri === uri : false)

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
      store.action(playerActions.playlistNavigation)(1)
    },

    triggerPlayPrevious(state) {
      store.action(playerActions.playlistNavigation)(-1)
    },

    triggerPause(state) {
      store.action(playerActions.updatePlayerStatus)({ syncPaused: true })
    },

    triggerTogglePlay(state) {
      store.action(playerActions.updatePlayerStatus)({
        syncPaused: !state.player.syncPaused,
      })
    },

    triggerSkipTrack(state, steeps) {
      const { currentPlaylist } = state.player
      const { uri, name, index, skippedTracks } = currentPlaylist
      const jump = index + steeps
      const direction = steeps > 0 ? 'Next' : 'Previous'

      const tracks = selectPlaylistStack(state, uri || name)
      const limit = jump < tracks.length - 1 && jump > 0

      // Reached last item
      if (!limit) {
        if (skippedTracks > 0) {
          // TODO: Notify user
          console.info('skipped-tracks:', skippedTracks)
        }

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
            currentPlaylist: {
              ...currentPlaylist,
              index: jump,
              skippedTracks: skippedTracks + 1,
            },
          },
        })

        store.action(playerActions[`triggerPlay${direction}`])()
      }
    },

    triggerSkipNextTrack(state) {
      store.action(playerActions.triggerSkipTrack)(1)
    },

    triggerSkipPreviousTrack(state) {
      store.action(playerActions.triggerSkipTrack)(-1)
    },
  }

  return {
    ...streamActions,
    ...playerActions,
  }
}
