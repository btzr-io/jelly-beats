import React from 'react'
import Icon from '@mdi/react'
import Lbry from '@/apis/lbry'
import classnames from 'classnames'

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

      // Thumbnail update
      /*
      if (track.thumbnail) {
        track.thumbnail.length &&
          track.thumbnail.length > 0 &&
          this.getPalette(track.thumbnail)
      }*/
    }
  }

  render() {
    // Get props
    const {
      uri,
      index,
      cache,
      player,
      streamData,
      favorites,
      doNavigate,
      playlist,
      setPlaylist,
      attempPlay,
      togglePlay,
      toggleFavorite,
    } = this.props

    const action = () => {
      // Toggle play or purchase
      !isDownloading && !isPlaying ? attempPlay(uri, null, true) : togglePlay()
      // Update playlist state
      playlist && setPlaylist({ ...playlist, index })
    }

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
    const { completed, isAvailable, isDownloading } = streamData

    //Get player status
    const { paused, isLoading, currentTrack } = player || {}
    const isActive = completed && (currentTrack ? currentTrack.uri === uri : false)
    const isPlaying = !paused && isActive

    // Favorite selector
    const isFavorite = favorites.indexOf(uri) > -1
    const showOverlay = isAvailable !== false && (isPlaying || isDownloading)

    const shouldPurchase = !isDownloading && !completed
    let buttonIcon = isDownloading ? icons.SPINNER : !isPlaying ? icons.PLAY : icons.PAUSE

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
          <div
            className={classnames('card--overlay', { 'card--overlay-show': showOverlay })}
          >
            {!(isAvailable === false) && (
              <Button
                icon={buttonIcon}
                iconColor={fee && !isPlaying ? 'var(--color-yellow)' : ''}
                type="card-action--overlay"
                size="large-x"
                toggle={isPlaying && !isDownloading}
                animation={isDownloading && 'spin'}
                onClick={() => {
                  action()
                }}
              />
            )}
          </div>
        </Thumbnail>
        <PriceLabel className={'card_label'} fee={fee} />
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
            {/* <Button
              icon={icons.PLUS}
              size="large"
              type="card-action"
              onClick={() => null}
              disabled={true}
            />
            */}
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
          </div>
        </div>
      </div>
    )
  }
}

export default Card
