import React from 'react'
import fs from 'fs'
import path from 'path'
import MediaElementWrapper from 'mediasource'
import css from '@/css/modules/player.css.module'

function getCodec(name) {
  var extname = path.extname(name).toLowerCase()
  return {
    '.m4a': 'audio/mp4; codecs="mp4a.40.5"',
    '.mp3': 'audio/mpeg',
  }[extname]
}

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.audioElement = React.createRef()
  }

  loadSource() {
    const { path } = this.props.fileSource
    const audio = this.audioElement.current
    audio.src = 'file:' + path
    audio.play()
  }

  createStream() {
    const { fileSource } = this.props
    const readable = fs.createReadStream(fileSource.path)
    const wrapper = new MediaElementWrapper(this.audioElement.current)
    // The correct mime type, including codecs, must be provided
    const writable = wrapper.createWriteStream(getCodec(fileSource.name))
    // Pipe stream
    readable.pipe(writable)
  }

  handleLoadStart = () => {
    const audio = this.audioElement.current
    audio.removeEventListener('loadstart', this.handleLoadStart)
    audio.play()
  }

  componentDidMount() {
    const audio = this.audioElement.current
    audio.addEventListener('error', err => {})
    audio.addEventListener('loadstart', this.handleLoadStart)

    const { fileSource } = this.props

    // Stream file
    if (fileSource.streaming) {
      this.createStream()
    } else {
      // load file
      this.loadSource()
    }
  }

  render() {
    const playerOptions = {
      autoPlay: true,
      controls: true,
    }

    return (
      <div className={css.player}>
        <audio ref={this.audioElement} {...playerOptions} />
      </div>
    )
  }
}

export default Header
