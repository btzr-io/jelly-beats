import React from 'react'
import fs from 'fs'
import path from 'path'
import MediaElementWrapper from 'mediasource'
import '@/css/slider.css'
import css from '@/css/modules/player.css.module'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Slider from './slider'

const ControlButton = ({ icon, action, disabled }) => {
  return (
    <button className={css.button} onClick={action} disabled={disabled}>
      <FontAwesomeIcon className={css.icon} size={'1x'} icon={['fas', icon]} fixedWidth />
    </button>
  )
}

function getCodec(name) {
  var extname = path.extname(name).toLowerCase()
  return {
    '.m4a': 'audio/mp4; codecs="mp4a.40.5"',
    '.mp3': 'audio/mpeg',
  }[extname]
}

class Player extends React.Component {
  constructor(props) {
    super(props)
    this.audioElement = React.createRef()
    this.state = {
      paused: true,
      duration: 0,
      currentTime: 0,
    }
  }

  loadSource() {
    const { path } = this.props.fileSource
    const audio = this.audioElement.current
    audio.src = 'file:' + path
    audio.load()
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

  play = () => {
    const audio = this.audioElement.current
    audio.play()

    // Update state
    this.setState({ paused: audio.paused })
  }

  pause = () => {
    const audio = this.audioElement.current
    audio.pause()

    // Update state
    this.setState({ paused: audio.paused })
  }

  togglePlay = () => {
    const audio = this.audioElement.current
    audio.paused ? this.play() : this.pause()
  }

  updateTime = () => {
    const audio = this.audioElement.current
    this.setState({ currentTime: audio.currentTime })
  }

  setCurrentTime = time => {
    const audio = this.audioElement.current
    audio.currentTime = time
  }

  handleMetadata = () => {
    const audio = this.audioElement.current
    this.setState({ duration: audio.duration })
  }

  handleLoadStart = () => {
    const audio = this.audioElement.current
    audio.removeEventListener('loadstart', this.handleLoadStart)
    this.play()
  }

  handleEnded = () => {
    this.pause()
  }

  componentWillUnmount() {
    const audio = this.audioElement.current
    audio.reomoveEventListener('ended', this.handleEnded)
    audio.removeEventListener('loadstart', this.handleLoadStart)
    audio.removeEventListener('loadedmetadata', this.handleMetadata)
    audio.removeEventListener('timeupdate', this.updateTime)
  }

  componentDidMount() {
    const audio = this.audioElement.current
    //audio.addEventListener('error', err => {})
    audio.addEventListener('ended', this.handleEnded)
    audio.addEventListener('loadstart', this.handleLoadStart)
    audio.addEventListener('loadedmetadata', this.handleMetadata)
    audio.addEventListener('timeupdate', this.updateTime)
    const { fileSource } = this.props

    // Stream file
    if (fileSource && fileSource.streaming) {
      this.createStream()
    } else if (fileSource) {
      // load file
      this.loadSource()
    }
  }

  render() {
    const playerOptions = {
      autoPlay: true,
      controls: true,
    }

    const { fileSource } = this.props
    const { currentTime, duration, paused } = this.state

    return (
      <div className={css.player + ' ' + (fileSource ? css.active : '')}>
        <Slider onChange={this.setCurrentTime} value={currentTime} max={duration} />
        <audio ref={this.audioElement} {...playerOptions} />
        <div className={css.controls}>
          <ControlButton icon={'step-backward'} disabled={true} />
          <ControlButton icon={paused ? 'play' : 'pause'} action={this.togglePlay} />
          <ControlButton icon={'step-forward'} disabled={true} />
        </div>
      </div>
    )
  }
}

export default Player
