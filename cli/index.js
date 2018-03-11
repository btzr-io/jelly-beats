#!/usr/bin/env node
'use strict'

const { spawn } = require('child_process')
const cmd = process.argv[2]
const commands = {}

// Dev command
commands['dev'] = () => {
  spawn('yarn', ['dev'], { stdio: 'inherit' })
}

// Format command
commands['format'] = () => {
  spawn('yarn', ['format'], { stdio: 'inherit' })
}

// Run command
commands[cmd] && commands[cmd]()
