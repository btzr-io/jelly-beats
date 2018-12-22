// @flow
import 'proxy-polyfill'

const CHECK_DAEMON_STARTED_TRY_NUMBER = 200

const Lbry = {
  isConnected: false,
  daemonConnectionString: 'http://localhost:5279',
  pendingPublishTimeout: 20 * 60 * 1000,
}

function checkAndParse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json()
  }
  return response.json().then(json => {
    let error
    if (json.error) {
      error = new Error(json.error)
    } else {
      error = new Error('Protocol error with unknown response signature')
    }
    return Promise.reject(error)
  })
}

function apiCall(method, params = {}, resolve, reject) {
  const counter = new Date().getTime()
  const options = {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: counter,
    }),
  }

  return fetch(Lbry.daemonConnectionString, options)
    .then(checkAndParse)
    .then(response => {
      const error = response.error || (response.result && response.result.error)

      if (error) {
        return reject(error)
      }
      return resolve(response.result)
    })
    .catch(reject)
}

const daemonCallWithResult = (name, params = {}) =>
  new Promise((resolve, reject) => {
    apiCall(
      name,
      params,
      result => {
        resolve(result)
      },
      reject
    )
  })

// blobs
Lbry.blob_delete = (params = {}) => daemonCallWithResult('blob_delete', params)
Lbry.blob_list = (params = {}) => daemonCallWithResult('blob_list', params)

// core
Lbry.status = (params = {}) => daemonCallWithResult('status', params)
Lbry.version = () => daemonCallWithResult('version', {})
Lbry.file_delete = (params = {}) => daemonCallWithResult('file_delete', params)
Lbry.file_set_status = (params = {}) => daemonCallWithResult('file_set_status', params)

// claims
Lbry.claim_list_by_channel = (params = {}) =>
  daemonCallWithResult('claim_list_by_channel', params)

// wallet
Lbry.account_balance = (params = {}) => daemonCallWithResult('account_balance', params)
Lbry.account_decrypt = () => daemonCallWithResult('account_decrypt', {})
Lbry.account_encrypt = (params = {}) => daemonCallWithResult('account_encrypt', params)
Lbry.address_is_mine = (params = {}) => daemonCallWithResult('address_is_mine', params)
Lbry.wallet_lock = () => daemonCallWithResult('wallet_lock', {})
Lbry.address_unused = (params = {}) => daemonCallWithResult('address_unused', params)
Lbry.wallet_send = (params = {}) => daemonCallWithResult('wallet_send', params)
Lbry.account_unlock = (params = {}) => daemonCallWithResult('account_unlock', params)
Lbry.address_unused = () => daemonCallWithResult('address_unused', {})
Lbry.claim_tip = (params = {}) => daemonCallWithResult('claim_tip', params)

// transactions
Lbry.transaction_list = (params = {}) => daemonCallWithResult('transaction_list', params)

Lbry.connectPromise = null
Lbry.connect = () => {
  if (Lbry.connectPromise === null) {
    Lbry.connectPromise = new Promise((resolve, reject) => {
      let tryNum = 0
      // Check every half second to see if the daemon is accepting connections
      function checkDaemonStarted() {
        tryNum += 1
        Lbry.status()
          .then(resolve)
          .catch(() => {
            if (tryNum <= CHECK_DAEMON_STARTED_TRY_NUMBER) {
              setTimeout(checkDaemonStarted, tryNum < 50 ? 400 : 1000)
            } else {
              reject(new Error('Unable to connect to LBRY'))
            }
          })
      }

      checkDaemonStarted()
    })
  }

  return Lbry.connectPromise
}

Lbry.getMediaType = (contentType, extname) => {
  if (extname) {
    const formats = [
      [/^(mp4|m4v|webm|flv|f4v|ogv)$/i, 'video'],
      [/^(mp3|m4a|aac|wav|flac|ogg|opus)$/i, 'audio'],
      [/^(html|htm|xml|pdf|odf|doc|docx|md|markdown|txt|epub|org)$/i, 'document'],
      [/^(stl|obj|fbx|gcode)$/i, '3D-file'],
    ]
    const res = formats.reduce((ret, testpair) => {
      switch (testpair[0].test(ret)) {
        case true:
          return testpair[1]
        default:
          return ret
      }
    }, extname)
    return res === extname ? 'unknown' : res
  } else if (contentType) {
    return /^[^/]+/.exec(contentType)[0]
  }
  return 'unknown'
}

/**
 * Wrappers for API methods to simulate missing or future behavior. Unlike the old-style stubs,
 * these are designed to be transparent wrappers around the corresponding API methods.
 */

/**
 * Returns results from the file_list API method, plus dummy entries for pending publishes.
 * (If a real publish with the same name is found, the pending publish will be ignored and removed.)
 */
Lbry.file_list = (params = {}) =>
  new Promise((resolve, reject) => {
    apiCall(
      'file_list',
      params,
      fileInfos => {
        resolve(fileInfos)
      },
      reject
    )
  })

Lbry.claim_list_mine = (params = {}) =>
  new Promise((resolve, reject) => {
    apiCall(
      'claim_list_mine',
      params,
      claims => {
        resolve(claims)
      },
      reject
    )
  })

Lbry.get = (params = {}) =>
  new Promise((resolve, reject) => {
    apiCall(
      'get',
      params,
      streamInfo => {
        resolve(streamInfo)
      },
      reject
    )
  })

Lbry.resolve = (params = {}) =>
  new Promise((resolve, reject) => {
    apiCall(
      'resolve',
      params,
      data => {
        if ('uri' in params) {
          // If only a single URI was requested, don't nest the results in an object
          resolve(data && data[params.uri] ? data[params.uri] : {})
        } else {
          resolve(data || {})
        }
      },
      reject
    )
  })

const lbryProxy = new Proxy(Lbry, {
  get(target, name) {
    if (name in target) {
      return target[name]
    }

    return (params = {}) =>
      new Promise((resolve, reject) => {
        apiCall(name, params, resolve, reject)
      })
  },
})

export default lbryProxy
