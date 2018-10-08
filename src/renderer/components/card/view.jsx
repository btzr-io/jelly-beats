import React from 'react'
import Tags from '@/components/tags'
import Health from '@/components/common/health'
import Button from '@/components/common/button'
import Icon from '@mdi/react'
import css from '@/css/modules/card.css.module'
import Thumbnail from './thumbnail'
import { Lbry } from 'lbry-redux'
import { getTags } from '@/utils/tags'
import * as icons from '@/constants/icons'

class Card extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { isReady: false }
  }

  toggleFavorite = () => {
    const { uri, favorites, addToFavorites, removefromFavorites } = this.props
    // Favorite selector
    const isFavorite = favorites.indexOf(uri) > -1
    // Toggle favorite
    !isFavorite ? addToFavorites(uri) : removefromFavorites(uri)
  }

  attempPlay = () => {
    const { uri, setTrack, purchase } = this.props
    setTrack(uri)
    purchase(uri)
  }

  componentDidMount() {
    const { uri, cache, favorites } = this.props
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
    const { uri, cache, downloads, favorites } = this.props

    // Get state
    const { isReady } = this.state

    // Get metadata
    const { title, artist, thumbnail } = cache[uri] || {}

    //Get stream status
    const { completed, isPlaying, isAvailable, isDownloading } = downloads[uri] || {}

    // Favorite selector
    const isFavorite = favorites.indexOf(uri) > -1

    return (
      <div
        className={
          css.card +
          ' ' +
          (isReady ? '' : css.placeholder) +
          (isAvailable === false ? css.block : '')
        }
        onClick={() => isReady && this.attempPlay()}
      >
        <Thumbnail className={css.thumb} src={thumbnail} />
        <div className={css.content}>
          <div className={css.metadata}>
            <div className={css.title}>
              <Health status={{ completed, isAvailable, isDownloading }} />
              {title}
            </div>
            <div className={css.subtitle}>{artist}</div>
          </div>
          <div className={css.actions}>
            <Button
              toggle={isFavorite}
              iconColor={isFavorite ? 'var(--color-red)' : ''}
              icon={isFavorite ? icons.HEART : icons.HEART_OUTLINE}
              type="card-action"
              size="large"
              onClick={this.toggleFavorite}
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
