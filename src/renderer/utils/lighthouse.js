const lighthouse = {}

lighthouse.API = 'https://lighthouse.lbry.io/search?s='

lighthouse.search = (query, queyOpts) => {
  const params = '&' + encodeURIParams(queyOpts)
  const promise = new Promise((resolve, reject) => {
    // Get all claims ( audio files only ) from a channel
    fetch(encodeURI(lighthouse.API + query + params))
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
        // Check for api errors
        json && json.length > 0 ? resolve(json) : reject(json)
      })
      .catch(error => {
        console.error(error.message)
        reject(error)
      })
  })
  return promise
}

lighthouse.searchChannels = (query, queyOpts) => {
  const params = {
    ...queryOpts,
    claimType: channel,
  }
  return lighthouse.search(query, params)
}

function encodeURIParams(params = []) {
  return Object.entries(params)
    .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
    .join('&')
}

export default lighthouse
