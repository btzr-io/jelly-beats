const fs = require('fs')
const path = require('path')
const markdownMagic = require('markdown-magic')

const config = {
  transforms: {
    CONTRIBUTORS: require('markdown-magic-github-contributors'),
  },
}

const markdownPath = path.join(__dirname, 'README.md')
markdownMagic(markdownPath, config)
