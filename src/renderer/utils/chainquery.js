const CHAINQUERY_API = 'https://chainquery.lbry.io/api/sql?query='

export function chainquery(sqlQuery) {
  const limit = 10
  const pageIndex = 0
  const paginate = ` LIMIT ${limit} OFFSET ${limit * pageIndex}`
  const promise = new Promise(resolve => {
    // Get all claims ( audio files only ) from a channel
    fetch(encodeURI(CHAINQUERY_API + sqlQuery + paginate))
      .then(response => {
        const contentType = response.headers.get('content-type')

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

export function fetchClaimsByChannel(id) {
  const channel = `publisher_id="${id}"`
  const filter = 'content_type LIKE "audio%"'
  const query = `SELECT * FROM claim WHERE ${channel} AND ${filter}`
  return chainquery(query)
}

export function fetchNewClaims() {
  const order = 'ORDER BY created_at DESC'
  const filter = 'content_type LIKE "audio%"'
  const query = `SELECT * FROM claim WHERE ${filter} ${order}`
  return chainquery(query)
}
