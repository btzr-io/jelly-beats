import React from 'react'
import fs from 'fs'
import path from 'path'
import stream from '@/utils/stream'
import MediaElementWrapper from 'mediasource'
import Icon from '@mdi/react'
import * as icons from '@/constants/icons'

import Slider from './slider'

// Import CSS
import '@/css/slider.css'
import css from '@/css/modules/player.css.module'

const ControlButton = ({ icon, action, size, disabled }) => {
  return (
    <button className={css.button} onClick={action} disabled={disabled}>
      <Icon path={icon} className={`icon icon--${size || 'large'}`} />
    </button>
  )
}

const StackButton = ({ thumbnail, stack }) => {
  const thumbnailStyle = {
    backgroundImage: thumbnail ? `url(${thumbnail})` : 'none',
  }
  return (
    <div className={css.stack}>
      <div className={css.stackThumb} style={thumbnailStyle} />
      <div className={css.stackLabel}>{'Empty'}</div>
    </div>
  )
}

// Move to static or utils
function getCodec(name) {
  var extname = path.extname(name).toLowerCase()
  return {
    '.m4a': 'audio/mp4; codecs="mp4a.40.5"',
    '.mp3': 'audio/mpeg',
  }[extname]
}

class Player extends React.PureComponent {
  static defaultProps = {
    track: {},
  }

  constructor(props) {
    super(props)
    this.audioElement = React.createRef()
    this.state = {
      paused: true,
      duration: 0,
      currentTime: 0,
      fileSource: null,
      currentTrack: null,
    }
  }

  loadSource() {
    const { fileSource } = this.state
    const audio = this.audioElement.current
    audio.src = 'file:' + fileSource.path
    audio.load()
  }

  createStream() {
    const { fileSource } = this.state
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

  handleStream = fileSource => {
    this.setState({ fileSource, pause: false })
  }

  handlePlay = () => {
    const { uri } = this.props.track
    uri && stream(uri, this.handleStream.bind(this))
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
  }

  componentDidUpdate(prevProps, prevState) {
    // New track selected
    if (prevProps.track.uri !== this.props.track.uri) {
      this.handlePlay()
    } else {
      // Get file
      const { fileSource } = this.state
      // If source exist
      if (fileSource) {
        // Get previous path
        const prevPath = prevState.fileSource ? prevState.fileSource.path : null
        // If file path change
        if (fileSource.path !== prevPath) {
          // Start steam or load file
          fileSource.streaming ? this.createStream() : this.loadSource()
        }
      }
    }
  }

  render() {
    const playerOptions = {
      autoPlay: true,
      controls: true,
    }

    const { uri, title, artist, thumbnail } = this.props.track
    const { fileSource, currentTime, duration, paused } = this.state

    const controls = [
      {
        icon: icons.SKIP_PREVIOUS,
        action: () => {},
        disabled: true,
      },
      {
        size: 'large-x',
        icon: paused ? icons.PLAY : icons.PAUSE,
        action: this.togglePlay,
        disabled: !fileSource,
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
      {
        icon: icons.HEART_OUTLINE,
        action: () => {},
        disabled: true,
      },
    ]

    return (
      <div className={css.player + ' ' + css.active}>
        <audio ref={this.audioElement} {...playerOptions} />

        <div className={css.container}>
          <div className={css.controls}>
            <div className={css.actions}>
              {controls.map((props, key) => (
                <ControlButton {...props} key={key} />
              ))}
            </div>

            <div className={css.trackData}>
              {title ? (
                <p>
                  <span className={css.trackTitle}>{title}</span>
                  <span className={css.divider}>&bull;</span>
                  <span className={css.trackArtist}>{artist}</span>
                </p>
              ) : (
                <p>
                  <span className={css.divider}>No track selected</span>
                </p>
              )}
              <Slider onChange={this.setCurrentTime} value={currentTime} max={duration} />
            </div>

            <div className={css.actions}>
              {actions.map((props, key) => (
                <ControlButton {...props} key={key + '_right'} />
              ))}
            </div>

            <StackButton thumbnail={thumbnail} />
          </div>
        </div>
      </div>
    )
  }
}

export default Player
