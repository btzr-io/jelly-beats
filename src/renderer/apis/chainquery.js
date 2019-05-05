const CHAINQUERY_API = 'https://chainquery.lbry.io/api/sql?query='

export function chainquery(sqlQuery, queryOpts) {
  const resultLimit = queryOpts ? queryOpts.limit : 10
  const pageIndex = queryOpts ? queryOpts.page : 0
  const paginate = ` LIMIT ${resultLimit} OFFSET ${resultLimit * pageIndex}`
  const promise = new Promise((resolve, reject) => {
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
          reject(error)
        }
      })
      .then(json => {
        if (json) {
          const { error, data } = json
          // Check for api errors
          !error ? resolve(data) : reject(error)
        } else {
          reject(new Error('Chainquery api failed'))
        }
      })
      .catch(error => {
        reject(error)
      })
  })
  return promise
}

export function fetchClaimsByChannel(id, queryOpts) {
  const channel = `publisher_id="${id}"`
  const filter = 'content_type LIKE "audio%"'
  const query = `SELECT * FROM claim WHERE ${channel} AND ${filter}`
  return chainquery(query, queryOpts)
}
export function fetchClaimsCountByChannel(id, queryOpts) {
  const channel = `publisher_id="${id}"`
  const filter = 'content_type LIKE "audio%"'
  const query = `SELECT COUNT(*) FROM claim WHERE ${channel} AND ${filter}`
  return chainquery(query, queryOpts)
}

export function fetchNewClaims(queryOpts) {
  const order = 'ORDER BY created_at DESC'
  const filter = 'content_type LIKE "audio%"'
  const query = `SELECT * FROM claim WHERE ${filter} ${order}`
  return chainquery(query, queryOpts)
}
