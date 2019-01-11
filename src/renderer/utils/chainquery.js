const CHAINQUERY_API = 'https://chainquery.lbry.io/api/sql?query='

export function fetchClaimsByChannel(id) {
  const channel = `publisher_id="${id}"`
  const filter = 'content_type LIKE "audio%"'
  const query = encodeURIComponent(`SELECT * FROM claim WHERE ${channel} AND ${filter}`)
  const promise = new Promise(resolve => {
    // Get all claims ( audio files only ) from a channel
    fetch(CHAINQUERY_API + query)
      .then(response => {
        const contentType = response.headers.get('content-type')
        console.info(response)
        if (
          response.ok &&
          contentType &&
          contentType.indexOf('application/json') !== -1
        ) {
          return response.json()
        } else {
          const error = new Error(response.statusText)
          error.response = response
          throw error
        }
      })
      .then(json => {
        const { error, data } = json
        // Check for api errors

        !error && resolve(data)
      })
      .catch(error => {
        console.error(error.message)
      })
  })
  return promise
}
