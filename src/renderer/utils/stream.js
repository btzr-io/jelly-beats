import { Lbry } from 'lbry-redux'

function stream(uri, fallback) {
  Lbry.get({ uri })
    .then(streamInfo => {
      const timeout =
        streamInfo === null || typeof streamInfo !== 'object' || streamInfo.error === 'Timeout'

      if (timeout) {
        // LOADING_VIDEO_FAILED,
        console.error('timeout', streamInfo)
      } else {
        // SUCCESS
        const { download_path: path, file_name: name, mime_type: mimeType } = streamInfo
        // fileSource
        const streaming = !streamInfo.completed
        fallback({ path, name, mimeType, streaming })
        console.log(uri, streamInfo)
      }
    })
    .catch(() => {
      console.error(
        `Failed to download ${uri}, please try again. If this problem persists, visit https://lbry.io/faq/support for support.`
      )
    })
}

export default stream
