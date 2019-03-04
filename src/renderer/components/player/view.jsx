import fs from 'fs'
import React from 'react'
import classnames from 'classnames'
import { ipcRenderer } from 'electron'
import { memoizeFormatDuration } from '@/utils/formatMediaTime'
import * as icons from '@/constants/icons'

// Components
import Icon from '@mdi/react'
import Slider from './slider'
import Button from '@/components/button'
import PlayerButton from './playerButton'

// Import CSS
import '@/css/slider.css'
import css from '@/css/modules/player.css.module'

const StackButton = ({ thumbnail, title, artist, doNavigate }) => {
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
    TODO: FIX IT!

    import MediaElementWrapper from 'mediasource'

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

    const { cache, player, settings } = this.props
    const { currentTrack } = player

    if (currentTrack) {
      const { duration, currentTime } = this.state
      currentTrack.duration = duration || 0
      currentTrack.currentTime = currentTime || 0

      const { palette } = cache[currentTrack.uri] || {}

      // Adaptive colors
      if (palette) {
        const root = document.documentElement
        root.style.setProperty('--adaptive-palette-dark', palette.dark)
        root.style.setProperty('--adaptive-palette-vibrant', palette.vibrant)
      }

      // Discord integration
      if (settings && settings.discord) {
        ipcRenderer.send('update-discord-presence', currentTrack)
      }
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

    const { player, updateStreamInfo, storeTrackDuration } = this.props
    const { uri } = player ? player.currentTrack : {}

    // Store duration
    this.setState({ duration })
    updateStreamInfo(uri, { duration })
    // storeTrackDuration(uri, duration)
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
    const { uri } = player.currentTrack || {}
    const prevTrack = prevProps.player.currentTrack || {}
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
          /* console.log({
            isActive,
            isPlaying,
            testNextSync: player.syncPaused,
          }) */

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
      navigation,
      playNext,
      playPrev,
      isFavorite,
      toggleFavorite,
      togglePlay,
      doNavigate,
      doNavigateBackward,
      canPlayPrev,
      canPlayNext,
      currentPlaylist,
      isPlayingCollection,
      streamStatus,
    } = this.props

    const { paused, syncPaused, currentTrack, showPlayer } = player
    const { uri, title, artist, thumbnail } = currentTrack
    const { currentPage, currentQuery } = navigation

    //Get stream status
    const { duration, completed, isDownloading } = streamStatus

    const collectionPath = isPlayingCollection && `/${currentPlaylist.uri}`
    const playlistPath = collectionPath || '/playlist'
    const playlistActive = currentPage === playlistPath

    const togglePlaylist = () =>
      !playlistActive ? doNavigate(playlistPath, currentPlaylist) : doNavigateBackward()

    const isPlaying = !paused && ready && completed

    const buttonIcon = isDownloading
      ? icons.SPINNER
      : !isPlaying
      ? icons.PLAY
      : icons.PAUSE

    const playerOptions = {
      autoPlay: true,
      controls: true,
    }

    const controls = [
      {
        type: 'control',
        icon: icons.SKIP_PREVIOUS,
        iconColor: canPlayPrev ? 'var(--main-color)' : '',
        action: () => playPrev(),
        disabled: !canPlayPrev,
      },
      {
        type: 'main-action',
        icon: buttonIcon,
        size: 'large-x',
        toggle: isPlaying,
        action: () => togglePlay(),
        disabled: !ready,
        animation: isDownloading && 'spin',
      },
      {
        type: 'control',
        icon: icons.SKIP_NEXT,
        iconColor: canPlayNext ? 'var(--main-color)' : '',
        action: () => playNext(),
        disabled: !canPlayNext,
      },
    ]

    const actions = [
      { type: 'action', icon: icons.SHUFFLE, action: () => {}, disabled: true },
      {
        type: 'action',
        icon: icons.REPEAT,
        iconColor: repeat ? 'var(--main-color)' : '',
        toggle: repeat,
        action: () => {
          this.toggleRepeat()
        },
        disabled: false,
      },
      {
        type: 'action',
        icon: isFavorite ? icons.HEART : icons.HEART_OUTLINE,
        iconColor: isFavorite ? 'var(--color-red)' : '',
        toggle: isFavorite,
        action: () => toggleFavorite(uri),
        disabled: false,
      },
      {
        type: 'action',
        icon: icons.PLAYLIST,
        iconColor: playlistActive ? 'var(--main-color)' : '',
        toggle: playlistActive,
        action: () => togglePlaylist(),
        disabled: false,
      },
    ]

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
                <PlayerButton {...props} key={key} />
              ))}
            </div>

            <div className={css.trackData}>
              <div className={css.seekBar}>
                <span className={css.currentTime}>
                  {memoizeFormatDuration(currentTime)}
                </span>
                <Slider
                  onChange={this.setCurrentTime}
                  value={currentTime}
                  max={duration}
                  disabled={!ready}
                />
                <span className={css.duration}>{memoizeFormatDuration(duration)}</span>
              </div>
            </div>

            <div className={css.actions}>
              {actions.map((props, key) => (
                <PlayerButton {...props} key={key + '_right'} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Player
