import React from 'react'
import fs from 'fs'
import path from 'path'
import MediaElementWrapper from 'mediasource'
import Slider from './slider'
import * as icons from '@/constants/icons'
import Icon from '@mdi/react'

// Import CSS
import '@/css/slider.css'
import css from '@/css/modules/player.css.module'

const ControlButton = ({ icon, action, disabled }) => {
  return (
    <button className={css.button} onClick={action} disabled={disabled}>
      <Icon path={icon} size={1.2} color={'#FFFFFF'} />
    </button>
  )
}

const ThumbCard = ({ src, author, title }) => {
  const thumbnailStyle = {
    backgroundImage: src ? `url(${src})` : 'none',
  }
  return (
    <div className={css.card}>
      <div className={css.thumbnail} style={thumbnailStyle} />
      <div className={css.trackInfo}>
        <p>{title}</p>
        <p className={css.author}>{author}</p>
      </div>
    </div>
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
      currentTrack: null,
    }
  }

  loadSource() {
    const { fileSource } = this.props.track
    const audio = this.audioElement.current
    audio.src = 'file:' + fileSource.path
    audio.load()
  }

  createStream() {
    const { fileSource } = this.props.track
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
    audio.removeEventListener('ended', this.handleEnded)
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
    const { fileSource } = this.props.track

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

    const { fileSource, author, title, thumbnail } = this.props.track
    const { currentTime, duration, paused } = this.state

    const controls = [
      {
        icon: icons.SKIP_PREVIOUS,
        action: () => {},

        disabled: true,
      },
      {
        icon: paused ? icons.PLAY : icons.PAUSE,
        action: this.togglePlay,
      },
      {
        icon: icons.SKIP_NEXT,
        action: () => {},
        disabled: true,
      },
    ]

    const actions = [
      {
        icon: icons.SHUFFLE,
        action: () => {},
        disabled: true,
      },
      {
        icon: icons.REPEAT,
        action: () => {},
        disabled: true,
      },
    ]

    return (
      <div className={css.player + ' ' + (fileSource ? css.active : '')}>
        <audio ref={this.audioElement} {...playerOptions} />

        <div className={css.container}>
          <ThumbCard src={thumbnail} author={author} title={title} />
          <div className={css.controls}>
            <div className={css.actions}>
              {controls.map((props, key) => (
                <ControlButton {...props} key={key} />
              ))}
            </div>
            <Slider onChange={this.setCurrentTime} value={currentTime} max={duration} />
            <div className={css.actions}>
              {actions.map((props, key) => (
                <ControlButton {...props} key={key + '_right'} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Player
