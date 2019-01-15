const fs = require('fs')
const contributors = require('github-contributors')
const gitRemoteUrl = require('remote-origin-url')
const format = require('github-url-from-git')
const util = require('util')
const execSync = util.promisify(require('child_process').execSync)

function readConfig(configPath) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    if (!('repoType' in config)) {
      config.repoType = 'github'
    }
    return config
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Configuration file not found: ${configPath}`)
    }
    throw error
  }
}

function addUsers(u) {
  let existingList = readConfig('.all-contributorsrc').contributors

  u.forEach(e => {
    if (!existingList.some(row => row.login.toLowerCase() === e.login.toLowerCase())) {
      console.log('Adding :', e.login)
      execSync(`all-contributors add -- ${e.login} code`)
    }
  })
}

;(function() {
  let repo = format(gitRemoteUrl.sync()).split('https://github.com/')[1]
  let contributions

  contributors(repo, {}, function(err, res) {
    if (err) {
      console.log(err)
    }
    contributions = res
    addUsers(contributions)
  })
})()
