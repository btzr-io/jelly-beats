import React from 'react'
import Icon from '@mdi/react'
import Lbry from '@/apis/lbry'
import clsx from 'clsx'

// import worker bundle
import Vibrant from 'node-vibrant/lib/bundle-worker'

import * as icons from '@/constants/icons'

// Components
import Button from '@/components/button'
import Health from '@/components/common/health'
import Loader from '@/components/common/loader'
import Thumbnail from '@/components/common/thumbnail'
import PriceLabel from '@/components/common/priceLabel'

import css from '@/css/modules/card.css.module'

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
        const rgb = palette.DarkMuted.getRgb()
        const dark = `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 0.4)`
        const vibrant = palette.Vibrant.getHex()

        storePalette(uri, { dark, vibrant })
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
    }
  }

  render() {
    // Get props
    const {
      uri,
      index,
      cache,
      player,
      favorites,
      fileSource,
      doNavigate,
      streamSource,
      playlist,
      setPlaylist,
      attempPlay,
      togglePlay,
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
    const { title, artist, thumbnail, palette, fee } = (cache && cache[uri]) || {}

    //Get stream status
    const { completed, isAvailable, isDownloading } = fileSource

    //Get player status
    const { paused, currentTrack } = player || {}
    const isActive = (completed || streamSource) && currentTrack.uri === uri
    const isPlaying = !paused && isActive
    const isLoading =
      (isActive && player.loading) ||
      fileSource.isDownloading ||
      (streamSource && !streamSource.ready)

    // Favorite selector
    const isFavorite = favorites.indexOf(uri) > -1
    const showOverlay = isAvailable !== false && (isPlaying || isLoading)

    const shouldPurchase = !isLoading && !completed
    let buttonIcon = isLoading ? icons.SPINNER : !isPlaying ? icons.PLAY : icons.PAUSE

    const action = () => {
      // Toggle play or purchase
      if (isActive && !isLoading) {
        togglePlay()
      } else if (!isLoading && !isPlaying) {
        attempPlay(uri, null)
      }

      // Update playlist state
      playlist && setPlaylist({ ...playlist, index })
    }

    return (
      <div
        className={
          css.card +
          ' ' +
          (isReady ? '' : css.placeholder) +
          (isAvailable === false ? css.block : '')
        }
      >
        <Thumbnail className={'card--thumbnail'} src={thumbnail}>
          <div className={clsx('card--overlay', { 'card--overlay-show': showOverlay })}>
            {!(isAvailable === false) && (
              <Button
                icon={buttonIcon}
                iconColor={fee && !isPlaying ? 'var(--color-yellow)' : ''}
                type="card-action--overlay"
                size="large-x"
                toggle={isPlaying && !isLoading}
                animation={isLoading && 'spin'}
                onClick={() => {
                  action()
                }}
              />
            )}
          </div>
        </Thumbnail>
        <div className={css.content}>
          <div className={css.metadata}>
            <div className={css.title} onClick={() => {}}>
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
            <PriceLabel className={'card_label'} fee={fee} />
            <div>
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
              {/*<Button
              icon={icons.PLUS}
              size="large"
              type="card-action"
              onClick={() => null}
              disabled={true}
              />
              */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Card
