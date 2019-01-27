import React from 'react'
import Button from '@/components/button'
import Health from '@/components/common/health'
import Loader from '@/components/common/loader'
import Icon from '@mdi/react'
import css from '@/css/modules/card.css.module'
import Thumbnail from './thumbnail'
import Lbry from '@/utils/lbry'
import { getTags } from '@/utils/tags'
import * as icons from '@/constants/icons'

// import worker bundle
import Vibrant from 'node-vibrant/lib/bundle-worker'

class Card extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { isReady: false }
  }

  getPalette(src) {
    // Adaptive UI
    const { storePalette, uri } = this.props
    Vibrant.from(src)
      .quality(10)
      .maxColorCount(32)
      .getPalette()
      .then(palette => {
        storePalette(uri, palette.Vibrant.hex)
      })
  }

  componentDidMount() {
    const { uri, cache, favorites, storePalette } = this.props
    cache[uri] && this.setState({ isReady: true })
  }

  componentDidUpdate(prevProps, prevState) {
    const { uri, cache, favorites } = this.props
    const prevTrack = prevProps.cache[prevProps.uri] || {}
    const track = cache[uri]
    if (track) {
      // Track uri updated
      if (track.uri != prevTrack.uri) this.setState({ isReady: true })

      // Thumbnail update
      if (track.thumbnail != prevTrack.thumbnail) {
        this.getPalette(track.thumbnail)
      }
    }
  }

  render() {
    // Get props
    const {
      uri,
      cache,
      player,
      downloads,
      favorites,
      doNavigate,
      togglePlay,
      attempPlay,
      toggleFavorite,
    } = this.props

    // Temp fix for:
    // Store properties undefined on "first render" #287
    if (!cache) return null

    // Remove unresolved claims
    if (cache && !cache[uri]) return null

    // Get state
    const { isReady } = this.state

    // Get metadata
    const { title, artist, thumbnail, palette } = (cache && cache[uri]) || {}

    //Get stream status
    const { completed, isAvailable, isDownloading } = (downloads && downloads[uri]) || {}

    //Get player status
    const { paused, isLoading, currentTrack } = player || {}
    const isActive = completed && (currentTrack ? currentTrack.uri === uri : false)
    const isPlaying = !paused && isActive
    // Favorite selector
    const isFavorite = favorites.indexOf(uri) > -1
    const showOverlay = !(isAvailable === false) && (isPlaying || isDownloading)

    const buttonIcon = isDownloading
      ? icons.SPINNER
      : !isPlaying
      ? icons.PLAY
      : icons.PAUSE

    return (
      <div
        className={
          css.card +
          ' ' +
          (isReady ? '' : css.placeholder) +
          (isAvailable === false ? css.block : '')
        }
      >
        <Thumbnail className={css.thumb} src={thumbnail} showOverlay={showOverlay}>
          {!(isAvailable === false) && (
            <Button
              icon={buttonIcon}
              type="card-action--overlay"
              size="large-x"
              toggle={isPlaying && !isDownloading}
              animation={isDownloading && 'spin'}
              onClick={() => {
                !isDownloading && !isPlaying ? attempPlay(uri, null, true) : togglePlay()
              }}
            />
          )}
        </Thumbnail>
        <div className={css.content}>
          <div className={css.metadata}>
            <div
              className={css.title}
              onClick={() => isReady && attempPlay(uri, null, true)}
            >
              <Health status={{ completed, isAvailable, isDownloading }} />
              {title}
            </div>
            {artist && (
              <div
                className={css.subtitle}
                onClick={() => doNavigate('/profile', { uri: artist.channelUri })}
              >
                {artist.channelName}
              </div>
            )}
          </div>
          <div className={css.actions}>
            <Button
              toggle={isFavorite}
              iconColor={isFavorite ? 'var(--color-red)' : ''}
              icon={isFavorite ? icons.HEART : icons.HEART_OUTLINE}
              type="card-action"
              size="large"
              // TODO: FIX IT!
              // tooltip={{ text: `${isFavorite ? 'Remove from' : 'Add to'} favorites` }}
              onClick={() => uri && toggleFavorite(uri)}
            />
            <Button
              icon={icons.PLAYLIST_PLUS}
              size="large"
              type="card-action"
              onClick={() => null}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Card
