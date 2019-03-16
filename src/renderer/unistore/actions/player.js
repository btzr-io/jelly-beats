import Lbry from '@/apis/lbry'
import { selectCalimByUri, selectStreamByUri } from '@/unistore/selectors/cache'
import { selectPlaylistQueue } from '@/unistore/selectors/player'
import { createStreamUrl } from '@/apis/stream'

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
    updateFileSourceInfo({ collections }, uri, fileData) {
      const { downloads } = collections
      const fileSource = { uri, ...fileData }
      const index = downloads.findIndex(item => item.uri === uri)
      // Update existent stream
      if (index !== -1) {
        return {
          collections: {
            ...collections,
            downloads: downloads.map((item, count) => {
              return index !== count ? item : { ...item, ...fileSource }
            }),
          },
        }
      }
      // Register new stream
      return {
        collections: {
          ...collections,
          downloads: downloads.concat(fileSource),
        },
      }
    },

    removeFileSource({ cache, collections }, uri) {
      let downloads = Object.assign([], collections.downloads)
      const index = downloads.findIndex(item => item.uri === uri)
      const { outpoint } = cache[uri]
      if (outpoint && index !== -1) {
        Lbry.file_delete({ outpoint, delete_from_download_dir: true }).then(deleted => {
          if (deleted) {
            downloads.splice(index, 1)
            store.setState({ collections: { ...collections, downloads } })
          }
        })
      }
    },

    removeFileSources({ cache, collections }, uris) {
      let downloads = Object.assign([], collections.downloads)

      uris.map(uri => {
        const index = downloads.findIndex(item => item.uri === uri)
        const { outpoint } = cache[uri]
        if (outpoint && index !== -1) {
          Lbry.file_delete({ outpoint, delete_from_download_dir: true }).then(
            deleted => {}
          )
          downloads.splice(index, 1)
        }
      })

      return { collections: { ...collections, downloads } }
    },

    handleDownloadError(state, uri) {
      console.error(
        `Failed to download ${uri}, please try again. If this problem persists, visit https://lbry.io/faq/support for support.`
      )
      // Dispatch updateTrackStatus action
      store.action(streamActions.updateFileSourceInfo)(uri, {
        completed: false,
        isAvailable: false,
        isDownloading: false,
      })
    },

    updateDownloadStatus(state, uri, outpoint) {
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
          store.action(streamActions.updateFileSourceInfo)(uri, {
            ...streamInfo,
            // Update status
            completed: true,
            isAvailable: true,
            isDownloading: false,
          })
        }
        // Download stopped ?
        else if (fileInfo && fileInfo.stopped) {
          store.action(streamActions.handleDownloadError)(uri)
        }
        // Downlading...
        else if (fileInfo) {
          // Debug
          console.info('Downloaing!')

          // Update progress
          streamInfo.progress = (fileInfo.written_bytes / fileInfo.total_bytes) * 100
          // Update stream info
          store.action(streamActions.updateFileSourceInfo)(uri, {
            ...streamInfo,
            // Update status
            completed: false,
            isAvailable: true,
            isDownloading: true,
          })

          // Next update
          setTimeout(() => {
            store.action(streamActions.updateDownloadStatus)(uri, outpoint)
          }, DOWNLOAD_POLL_INTERVAL)
        }
      })
    },

    downloadSource(state, uri, outpoint) {
      // Debug
      console.info('Downloading start!')

      // Start download
      store.action(streamActions.updateFileSourceInfo)(uri, {
        completed: false,
        isDownloading: true,
      })

      Lbry.get({ uri, timeout: DOWNLOAD_TIMEOUT })
        .then(streamInfo => {
          const timeout = !streamInfo || streamInfo.error === 'Timeout'
          timeout
            ? store.action(streamActions.handleDownloadError)(uri)
            : store.action(streamActions.purchase)(uri, streamInfo.outpoint)
        })
        .catch(() => {
          store.action(streamActions.handleDownloadError)(uri)
        })
    },

    createStream(state, uri) {
      const claim = selectCalimByUri(state, uri)
      // Claim missing from cach or existning / invalid stream
      if (!claim || claim.fee || !claim.artist || state.streams[uri]) return null

      const { artist, name } = claim
      const { channelId, channelName } = artist
      const streamSources = createStreamUrl(channelName, channelId, name)
      const stream = { ...streamSources, ready: false }
      return { streams: { ...state.streams, [uri]: stream } }
    },

    resolveStream({ streams }, uri) {
      const stream = streams[uri]
      if (!stream || !stream.url) return null
      fetch(stream.url)
        .then(response => {
          const { ok, headers, redirected } = response
          const contentType = headers.get('content-type')
          const isJson = contentType && contentType.indexOf('application/json') !== -1
          if (redirected && isJson) {
            return response.json()
          } else if (ok) {
            store.action(streamActions.updateStreamInfo)(uri, { ready: true })
          }
        })
        .then(data => {
          const { success, completed } = data || {}
          if (success) {
            store.action(streamActions.updateStreamInfo)(uri, { ready: completed })
            // Retry
            if (!completed) {
              setTimeout(() => {
                store.action(streamActions.resolveStream)(uri)
              }, 2500)
            }
          }
        })
        .catch(err => {
          console.error(err)
        })
    },

    updateStreamInfo({ streams }, uri, streamInfo) {
      if (streams[uri]) {
        return {
          streams: { ...streams, [uri]: { ...streams[uri], ...streamInfo } },
        }
      }
    },

    purchase(state, uri, outpoint) {
      //...
      const claim = selectCalimByUri(state, uri)
      const claimOutpoint = outpoint || (claim && claim.outpoint)
      // Claim missing from cache
      if (!claim || !claimOutpoint) return null

      Lbry.file_list({ outpoint: claimOutpoint, full_status: true }).then(
        ([fileInfo]) => {
          // We already fully downloaded the file.
          if (fileInfo && fileInfo.completed) {
            // Reconstruct file:
            // If written_bytes is false that means the user has deleted/moved the
            // file manually on their file system, so we need to dispatch a
            // do downloadSource action to reconstruct the file from the blobs
            if (!fileInfo.written_bytes) {
              console.error(fileInfo)
              store.action(streamActions.downloadSource)(uri, claimOutpoint)
            }
            // Success!
            else {
              // Update downloads
              store.action(streamActions.updateDownloadStatus)(uri, claimOutpoint)
            }
          }
          // Downlading
          else if (fileInfo) {
            store.action(streamActions.updateDownloadStatus)(uri, claimOutpoint)
          }
          // No download yet
          else if (!fileInfo) {
            // Todo add flag to protect purchase
            store.action(streamActions.downloadSource)(uri, claimOutpoint)
          }
        }
      )
    },
  }

  const playerActions = {
    setTrack(state, uri, playlist) {
      const track = state.cache[uri]
      if (track) {
        // Select track
        store.setState({
          player: {
            ...state.player,
            currentTrack: track,
          },
        })

        // Update playlist
        playlist && store.action(playerActions.setPlaylist)(playlist)
      }
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
      const { cache, player } = state
      const { currentPlaylist } = player
      const { uri, name, index, skippedTracks } = currentPlaylist
      const jump = index + steeps
      const tracks = selectPlaylistQueue(state, uri || name)
      const direction = steeps > 0 ? 'Next' : 'Previous'

      const limit = jump < tracks.length && jump > -1

      // Last track is current index
      if (tracks && limit) {
        // Get claim uri
        const uri = tracks[jump]
        const fileInfo = selectStreamByUri(state, uri)
        const isFree = cache[uri] && !cache[uri].fee
        const { isAvailable, completed } = fileInfo || {}
        const shouldSkip = !isFree && !completed
        const shouldAttempPlay = uri && !shouldSkip

        if (shouldAttempPlay) {
          store.action(playerActions.triggerAttempPlay)(uri, { name, index: jump })
        } else if (shouldSkip) {
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
      const { paused, loading, currentTrack } = player || {}

      // Get claim data
      const claim = uri && cache[uri]

      //Get stream status
      const { isDownloading, isAvailable, completed } =
        selectStreamByUri(state, uri) || {}

      const shouldTogglePlay =
        isAvailable && completed && (currentTrack ? currentTrack.uri === uri : false)

      const shouldAttempPurchase = claim && claim.fee

      const shouldStreamSource = !isDownloading && !completed

      if (shouldTogglePlay) {
        // Try to play content
        if (!isDownloading && !loading) {
          store.action(playerActions.triggerTogglePlay)()
          playlist && store.action(playerActions.setPlaylistIndex)(playlist.index)
        }
      } else if (shouldAttempPurchase || completed) {
        // Try to purchase and download free content
        store.action(playerActions.setTrack)(uri)
        shouldAttempPurchase && store.action(streamActions.purchase)(uri)
        playlist && store.action(playerActions.setPlaylistIndex)(playlist.index)
      } else if (shouldStreamSource) {
        store.action(playerActions.setTrack)(uri)
        store.action(streamActions.createStream)(uri)
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

      const tracks = selectPlaylistQueue(state, uri || name)
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
