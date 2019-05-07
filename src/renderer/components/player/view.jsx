import fs from 'fs'
import React from 'react'
import clsx from 'clsx'
import { ipcRenderer } from 'electron'
import { memoizeFormatDuration } from '@/utils/formatMediaTime'
import * as icons from '@/constants/icons'

// Components
import Icon from '@mdi/react'
import Slider from './slider'
import Banner from './banner'
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
      bufferedProgress: 0,
    }
  }

  loadSource = source => {
    const audio = this.audioElement.current
    audio.src = source
    audio.load()
  }

  updateBuffer = () => {
    const audio = this.audioElement.current
    const { duration } = audio
    const lastIndex = audio.buffered.length - 1

    if (duration > 0 && lastIndex !== -1) {
      const bufferedEnd = audio.buffered.end(lastIndex)
      const bufferedProgress = (bufferedEnd / duration) * 100

      if (bufferedProgress !== this.state.bufferedProgress) {
        this.setState({ bufferedProgress })
      }
    }
  }

  playAudio = async () => {
    const { duration, currentTime } = this.state
    const { cache, player, settings } = this.props
    const { currentTrack } = player
    const audio = this.audioElement.current

    try {
      await audio.play()

      if (currentTrack) {
        // Discord integration
        if (settings && settings.discord) {
          currentTrack.duration = duration || 0
          currentTrack.currentTime = currentTime || 0
          ipcRenderer.send('update-discord-presence', currentTrack)
        }
      }
    } catch (err) {
      // TODO: Better error handler
      // Silent error: https://github.com/btzr-io/jelly-beats/issues/301
      // console.error(err)
    }
  }

  play = () => {
    const audio = this.audioElement.current

    if (audio.paused) {
      this.playAudio()
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
      duration: 0,
      currentTime: 0,
      bufferedProgress: 0,
    })
    updatePlayerStatus({ loading: true, waiting: false })
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
    // DEBUG:
    console.info('Metadata: loaded!')

    // Get audio duration
    const audio = this.audioElement.current
    const duration = audio.duration
    const { player, streamSource, updateFileSourceInfo, updateStreamInfo } = this.props
    const { uri } = player ? player.currentTrack : {}

    // Store duration (NEEDS REFACTORING)
    this.setState({ duration })
    this.updateBuffer()
    updateFileSourceInfo(uri, { duration })
  }

  handleLoadStart = () => {
    const { player, streamSource, updateStreamInfo, updatePlayerStatus } = this.props
    const { uri } = player ? player.currentTrack : {}
    const audio = this.audioElement.current
    // ready to play
    console.info('New track loaded!')
    this.setState({ ready: true })
    updatePlayerStatus({ loading: false, showPlayer: true })
    this.play()
  }

  handlePlaying = () => {
    // Update state
    const { updatePlayerStatus } = this.props
    const audio = this.audioElement.current
    this.updateBuffer()
    updatePlayerStatus({ loading: false, paused: audio.paused, syncPaused: audio.paused })
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

  handleError = event => {
    const { showPlayerBanner } = this.props
    const { error } = event.target
    let message
    switch (error.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        message = 'The user canceled the audio.'
        break
      case MediaError.MEDIA_ERR_NETWORK:
        message = 'A network error occurred while fetching the audio.'
        break
      case MediaError.MEDIA_ERR_DECODE:
        message = 'An error occurred while decoding the audio.'
        break
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        message = 'The audio is missing or is in a format not supported by your browser.'
        break
      default:
        message = 'An unknown error occurred.'
        break
    }

    // Debug
    console.error(message, error)
    showPlayerBanner(message)
  }

  handleWaiting = () => {
    const { updatePlayerStatus } = this.props
    this.updateBuffer()
    updatePlayerStatus({ loading: true })
  }

  toggleEventListeners(type) {
    const audio = this.audioElement.current
    const action = type === 'add' ? 'addEventListener' : 'removeEventListener'
    audio[action]('ended', this.handleEnded)
    audio[action]('playing', this.handlePlaying)
    audio[action]('progress', this.updateBuffer)
    audio[action]('loadstart', this.handleLoadStart)
    audio[action]('loadedmetadata', this.handleMetadata)
    audio[action]('waiting', this.handleWaiting)
    audio[action]('timeupdate', this.updateTime)
    audio[action]('error', this.handleError)
  }

  componentWillUnmount() {
    this.toggleEventListeners('remove')
  }

  componentDidMount() {
    this.toggleEventListeners('add')
  }

  componentDidUpdate(prevProps, prevState) {
    // OPTIMIZE AND IMPROVE THIS MESS!
    const { fileSource, player, togglePlay, streamSource } = this.props
    const { uri } = player.currentTrack || {}
    const prevTrack = prevProps.player.currentTrack || {}
    const prevStreamSource = prevProps.streamSource || {}
    const sourceLoaded =
      (fileSource.path && fileSource.completed) || (streamSource && streamSource.ready)

    // If source exist
    if (fileSource.path) {
      // Get previous path
      const prevSource = prevProps.fileSource
      // If file path change or Download completed
      if (
        fileSource.path !== prevSource.path ||
        prevSource.completed != fileSource.completed
      ) {
        // Start steam or load file
        if (fileSource.completed) {
          // Track is ready
          this.loadSource('file://' + fileSource.path)
        } else {
          this.reset()
        }
      }
    } else if (!fileSource.completed && streamSource) {
      if (streamSource.url !== prevStreamSource.url) {
        if (streamSource.ready) {
          this.loadSource(streamSource.url)
        } else {
          this.reset()
          this.props.resolveStream(uri)
        }
      }

      if (streamSource.ready !== prevStreamSource.ready) {
        streamSource.ready && this.loadSource(streamSource.url)
      }
    }

    if (sourceLoaded) {
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
          // Try to play
          if (!player.syncPaused && !isPlaying) this.play()
          // Try to pause
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
    const { ready, repeat, duration, currentTime, bufferedProgress } = this.state
    const {
      player,
      navigation,
      playNext,
      playPrev,
      isLoading,
      isFavorite,
      toggleFavorite,
      togglePlay,
      doNavigate,
      doNavigateBackward,
      canPlayPrev,
      canPlayNext,
      fileSource,
      streamSource,
      currentPlaylist,
      isPlayingCollection,
    } = this.props

    const { loading, paused, syncPaused, currentTrack, showPlayer } = player
    const { uri, title, artist, thumbnail } = currentTrack
    const { currentPage, currentQuery } = navigation

    //Get stream status
    const { completed } = fileSource

    const collectionPath = isPlayingCollection && `/${currentPlaylist.uri}`
    const playlistPath = collectionPath || '/playlist'
    const playlistActive = currentPage === playlistPath

    const togglePlaylist = () =>
      !playlistActive ? doNavigate(playlistPath, currentPlaylist) : doNavigateBackward()

    // TODO: OPTIMIZE
    const currentTimeProgress = (currentTime / duration) * 100
    const isBusy = isLoading || !bufferedProgress || loading
    const isPlaying = !paused && ready && !isBusy
    const buttonIcon = isBusy ? icons.SPINNER : !isPlaying ? icons.PLAY : icons.PAUSE

    const playerOptions = {
      preload: 'auto',
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
        disabled: isBusy,
        animation: isBusy && 'spin',
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
        <Banner />
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
                  buffered={bufferedProgress}
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
