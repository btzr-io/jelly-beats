import os from 'os'
import path from 'path'
import { spawn, execSync } from 'child_process'

// Get daemon location from lbry-desktop ap
export default class Daemon {
  static getPath = () => {
    const Root = {
      Linux: '/opt/LBRY/resources/',
      Darwin: '/Applications/LBRY.app/Contents/Resources/',
      Windows_NT: 'C:/Program Files/LBRY/resources/',
    }
    return process.env.LBRY_DAEMON || Root[os.type] + 'static/daemon/lbrynet'
  }

  constructor() {
    this.handlers = []
    this.subprocess = undefined
  }

  launch() {
    this.subprocess = spawn(Daemon.getPath(), ['start'])
    this.subprocess.stdout.on('data', data => console.log(`Daemon: ${data}`))
    this.subprocess.stderr.on('data', data => console.error(`Daemon: ${data}`))
    this.subprocess.on('exit', () => this.fire('exit'))
    this.subprocess.on('error', error => console.error(`Daemon error: ${error}`))
  }

  quit() {
    if (process.platform === 'win32') {
      try {
        execSync(`taskkill /pid ${this.subprocess.pid} /t /f`)
      } catch (error) {
        console.error(error.message)
      }
    } else {
      this.subprocess.kill()
    }
  }

  // Follows the publish/subscribe pattern

  // Subscribe method
  on(event, handler, context = handler) {
    this.handlers.push({ event, handler: handler.bind(context) })
  }

  // Publish method
  fire(event, args) {
    this.handlers.forEach(topic => {
      if (topic.event === event) topic.handler(args)
    })
  }
}
