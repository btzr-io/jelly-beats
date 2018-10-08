import React from 'react'
import fs from 'fs'
import MediaElementWrapper from 'mediasource'
import Icon from '@mdi/react'
import * as icons from '@/constants/icons'
import classnames from 'classnames'
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

class Player extends React.PureComponent {
  static defaultProps = {
    track: {},
  }

  constructor(props) {
    super(props)
    this.audioElement = React.createRef()
    this.state = {
      ready: false,
      paused: true,
      duration: 0,
      currentTime: 0,
    }
  }

  createStream() {
    /*
    const { fileSource } = this.state
    const readable = fs.createReadStream(fileSource.path)
    const wrapper = new MediaElementWrapper(this.audioElement.current)
    // The correct mime type, including codecs, must be provided
    const writable = wrapper.createWriteStream(getCodec(fileSource.name))
    // Pipe stream
    readable.pipe(writable)
    */
  }

  loadSource = fileSource => {
    const audio = this.audioElement.current
    audio.src = 'file:' + fileSource.path
    audio.load()
  }

  play = () => {
    const audio = this.audioElement.current
    audio.play()
  }

  pause = () => {
    const audio = this.audioElement.current
    audio.pause()

    // Update state
    this.setState({ paused: audio.paused })
  }

  reset = () => {
    console.info('Clear state!')
    const audio = this.audioElement.current
    // Reset time
    audio.pause()
    audio.currentTime = 0
    // Reset state
    this.setState({
      ready: false,
      paused: audio.paused,
      currentTime: audio.currentTime,
    })
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
    // ready to play
    console.info('New track loaded!')
    this.setState({ ready: true })
    this.play()
  }

  handlePlaying = () => {
    // Update state
    const audio = this.audioElement.current
    this.setState({ paused: audio.paused })
  }

  handleEnded = () => {
    this.pause()
  }

  componentWillUnmount() {
    const audio = this.audioElement.current
    audio.removeEventListener('ended', this.handleEnded)
    audio.removeEventListener('playing', this.handlePlaying)
    audio.removeEventListener('loadstart', this.handleLoadStart)
    audio.removeEventListener('loadedmetadata', this.handleMetadata)
    audio.removeEventListener('timeupdate', this.updateTime)
  }

  componentDidMount() {
    const audio = this.audioElement.current
    //audio.addEventListener('error', err => {})
    audio.addEventListener('ended', this.handleEnded)
    audio.addEventListener('playing', this.handlePlaying)
    audio.addEventListener('loadstart', this.handleLoadStart)
    audio.addEventListener('loadedmetadata', this.handleMetadata)
    audio.addEventListener('timeupdate', this.updateTime)
  }

  componentDidUpdate(prevProps, prevState) {
    const { downloads, player } = this.props
    const { uri } = player ? player.currentTrack : {}
    const prevTrack = prevProps.player ? prevProps.player.currentTrack : {}
    const fileSource = downloads[uri]
    // If source exist
    if (fileSource) {
      // Get previous path
      const prevSource = prevProps.downloads[prevTrack.uri] || {}
      // If file path change or Download completed
      if (
        fileSource.path !== prevSource.path ||
        prevSource.completed != fileSource.completed
      ) {
        // Start steam or load file
        if (fileSource.completed) {
          // Track is ready
          this.loadSource(fileSource)
        } else {
          // Loading track
          this.reset()
        }
      }
    } else if (uri !== prevTrack.uri) {
      // Load new track
      this.reset()
    }
  }

  render() {
    const { player } = this.props
    const { ready, paused, duration, currentTime } = this.state

    const { uri, title, artist, thumbnail } = player ? player.currentTrack : {}

    const playerOptions = {
      autoPlay: true,
      controls: true,
    }

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
        disabled: !ready,
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
              {ready ? (
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
              <Slider
                onChange={this.setCurrentTime}
                value={currentTime}
                max={duration}
                disabled={!ready}
              />
            </div>

            <div className={css.actions}>
              {actions.map((props, key) => (
                <ControlButton {...props} key={key + '_right'} />
              ))}
            </div>

            <StackButton thumbnail={ready ? thumbnail : false} />
          </div>
        </div>
      </div>
    )
  }
}

export default Player
