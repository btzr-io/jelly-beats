import fs from 'fs'
import React from 'react'
import moment from 'moment'
import MediaElementWrapper from 'mediasource'
import Icon from '@mdi/react'
import Button from '@/components/button'
import * as icons from '@/constants/icons'
import classnames from 'classnames'
import Slider from './slider'
import { ipcRenderer } from 'electron'

const formatTime = (seconds = 0) => moment.utc(seconds * 1000).format('mm:ss')

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

const ActionButton = ({ icon, action, size, disabled, color, toggle }) => {
  return (
    <Button
      type={'player-action'}
      onClick={action}
      disabled={disabled}
      toggle={toggle}
      icon={icon}
      iconColor={color}
      size={'large'}
    />
  )
}

const StackButton = ({ thumbnail, title, artist, doNavigate }) => {
  // const { name, totalTracks } = playlist || {}
  // const label = name + (totalTracks ? ` (${totalTracks})` : '')

  const thumbnailStyle = {
    backgroundImage: thumbnail ? `url(${thumbnail})` : 'none',
  }

  return (
    <div className={css.stack}>
      <div className={css.stackThumb} style={thumbnailStyle} />
      <div className={css.stackLabel}>
        <p className={css.labelLink}>{title}</p>
        {artist && (
          <p className={css.artist}>
            by{' '}
            <span
              className={css.labelLink}
              onClick={() => doNavigate('/profile', { uri: artist.channelUri })}
            >
              {artist.channelName}
            </span>
          </p>
        )}
      </div>
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
      repeat: false,
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

    const { cache, player } = this.props
    const { currentTrack } = player || {}

    if (currentTrack) {
      const { duration, currentTime } = this.state
      currentTrack.duration = duration || 0
      currentTrack.currentTime = currentTime || 0

      const { palette } = cache[currentTrack.uri] || {}
      // Adaptive UI
      palette && document.documentElement.style.setProperty('--main-color', palette)
      // Discord integration
      ipcRenderer.send('update-discord-presence', currentTrack)
    }
  }

  pause = () => {
    const { updatePlayerStatus } = this.props
    const audio = this.audioElement.current
    audio.pause()
    updatePlayerStatus({
      paused: audio.paused,
      syncPaused: audio.paused,
    })
    console.info('PAUSED')
  }

  reset = () => {
    const { updatePlayerStatus } = this.props
    const audio = this.audioElement.current
    // Reset time
    audio.pause()
    audio.currentTime = 0
    // Reset state
    this.setState({
      ready: false,
      currentTime: audio.currentTime,
    })
    updatePlayerStatus({ isLoading: true })
  }

  toggleRepeat = () => {
    this.setState(prevState => ({ repeat: !prevState.repeat }))
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
    // Get audio duration
    const audio = this.audioElement.current
    const duration = audio.duration

    const { player, updateStreamInfo } = this.props
    const { uri } = player ? player.currentTrack : {}

    // Store duration
    this.setState({ duration })
    updateStreamInfo(uri, { duration })
  }

  handleLoadStart = () => {
    const { updatePlayerStatus } = this.props
    const audio = this.audioElement.current
    // ready to play
    console.info('New track loaded!')
    this.setState({ ready: true })
    updatePlayerStatus({ isLoading: false, showPlayer: true })
    this.play()
  }

  handlePlaying = () => {
    // Update state
    const { updatePlayerStatus } = this.props
    const audio = this.audioElement.current
    updatePlayerStatus({ paused: audio.paused, syncPaused: audio.paused })
  }

  handleEnded = () => {
    const { repeat } = this.state
    const { playNext, canPlayNext } = this.props

    // Fix sync
    this.pause()

    if (repeat) {
      this.updateTime(0)
      this.play()
    } else if (canPlayNext) {
      playNext()
    }
  }

  toggleEventListeners(type) {
    const audio = this.audioElement.current
    const action = type === 'add' ? 'addEventListener' : 'removeEventListener'
    audio[action]('ended', this.handleEnded)
    audio[action]('playing', this.handlePlaying)
    audio[action]('loadstart', this.handleLoadStart)
    audio[action]('loadedmetadata', this.handleMetadata)
    audio[action]('timeupdate', this.updateTime)
  }

  componentWillUnmount() {
    this.toggleEventListeners('remove')
  }

  componentDidMount() {
    //audio.addEventListener('error', err => {})
    this.toggleEventListeners('add')
  }

  componentDidUpdate(prevProps, prevState) {
    // OPTIMIZE AND IMPROVE THIS MESS!
    const { downloads, player, togglePlay } = this.props
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
          this.reset()
        }
      }

      if (uri && player) {
        const audio = this.audioElement.current
        const isActive = player.currentTrack.uri === uri
        const isPlaying = isActive && !player.paused
        // Player status desynchronized:
        // It means that the user requested a trigger action
        if (
          audio &&
          player.syncPaused !== player.paused &&
          player.syncPaused !== prevProps.player.syncPaused
        ) {
          // Try to sync back
          console.log({
            isActive,
            isPlaying,
            testNextSync: player.syncPaused,
          })
          // Try to play
          if (!player.syncPaused && !isPlaying) this.play()
          else if (player.syncPaused && isPlaying) this.pause()
        }
      }
    }

    if (uri !== prevTrack.uri) {
      // Load new track
      this.reset()
    }
  }

  render() {
    const { ready, repeat, currentTime } = this.state
    const {
      player,
      downloads,
      playNext,
      playPrev,
      isFavorite,
      toggleFavorite,
      togglePlay,
      doNavigate,
      canPlayPrev,
      canPlayNext,
      currentPlaylist,
    } = this.props

    const { paused, syncPaused, currentTrack, showPlayer } = player || {}
    const { uri, title, artist, thumbnail } = currentTrack || {}

    const playerOptions = {
      autoPlay: true,
      controls: true,
    }

    const controls = [
      {
        icon: icons.SKIP_PREVIOUS,
        action: () => playPrev(),
        disabled: !canPlayPrev,
      },
      {
        size: 'large-x',
        icon: paused ? icons.PLAY : icons.PAUSE,
        action: () => togglePlay(),
        disabled: !ready,
      },
      {
        icon: icons.SKIP_NEXT,
        action: () => playNext(),
        disabled: !canPlayNext,
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
        color: repeat ? 'var(--main-color)' : '',
        toggle: repeat,
        action: () => {
          this.toggleRepeat()
        },
        disabled: false,
      },
      {
        icon: isFavorite ? icons.HEART : icons.HEART_OUTLINE,
        color: isFavorite ? 'var(--color-red)' : '',
        toggle: isFavorite,
        action: () => toggleFavorite(uri),
        disabled: false,
      },
    ]

    const fileSource = (downloads && downloads[uri]) || {}
    const { duration, isDownloading } = fileSource

    return (
      <div className={css.player + ' ' + (showPlayer ? css.active : '')}>
        <audio ref={this.audioElement} {...playerOptions} />

        <div className={css.container}>
          <div className={css.controls}>
            <StackButton
              artist={artist}
              title={title}
              playlist={currentPlaylist}
              thumbnail={ready ? thumbnail : false}
              doNavigate={doNavigate}
            />

            <div className={css.actions}>
              {controls.map((props, key) => (
                <ControlButton {...props} key={key} />
              ))}
            </div>

            <div className={css.trackData}>
              <div className={css.seekBar}>
                <span className={css.currentTime}>{formatTime(currentTime)}</span>
                <Slider
                  onChange={this.setCurrentTime}
                  value={currentTime}
                  max={duration}
                  disabled={!ready}
                />
                <span className={css.duration}>{formatTime(duration)}</span>
              </div>
            </div>

            <div className={css.actions}>
              {actions.map((props, key) => (
                <ActionButton {...props} key={key + '_right'} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Player
