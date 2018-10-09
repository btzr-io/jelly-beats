import Lbry from '@/utils/lbry'
import { selectCalimByUri } from '@/unistore/selectors/cache'

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
  const actions = {
    updateStreamInfo(state, uri, streamInfo) {
      return {
        downloads: {
          ...state.downloads,
          [uri]: { ...state.downloads[uri], ...streamInfo },
        },
      }
    },

    handleStreamError(state, uri) {
      console.error(
        `Failed to download ${uri}, please try again. If this problem persists, visit https://lbry.io/faq/support for support.`
      )
      // Dispatch updateTrackStatus action
      store.action(actions.updateStreamInfo)(uri, {
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
          store.action(actions.updateStreamInfo)(uri, {
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
          store.action(actions.updateStreamInfo)(uri, {
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
      store.action(actions.updateStreamInfo)(uri, {
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
              store.action(actions.loadSource)(uri, claimOutpoint)
            }
            // Success!
            else {
              // Update downloads
              console.info(claim.fee)
              store.action(actions.updateLoadStatus)(uri, claimOutpoint)
            }
          }
          // Downlading
          else if (fileInfo) {
            store.action(actions.updateLoadStatus)(uri, claimOutpoint)
          }
          // No download yet
          else if (!fileInfo) {
            // Only free or below 1 usd for testing
            if (!claim.fee || (claim.fee && claim.fee.amount < 1))
              store.action(actions.loadSource)(uri, claimOutpoint)
          }
        }
      )
    },
  }

  return actions
}
