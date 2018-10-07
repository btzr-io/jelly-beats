import React from 'react'
import Tags from '@/components/tags'
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
    this.state = {
      track: {},
      isReady: false,
    }
  }

  toggleFavorite = () => {
    const { addToFavorites, removefromFavorites, uri } = this.props
    this.setState(prevState => {
      !prevState.track.isFavorite ? addToFavorites(uri) : removefromFavorites(uri)
      const track = Object.assign({}, prevState.track)
      track.isFavorite = !track.isFavorite
      return { track }
    })
  }

  handleClick = () => {
    const { uri, doNavigate } = this.props
    const { metadata } = this.state
    doNavigate('/track', { uri, metadata })
  }

  getMetadata(certificate, claim) {
    const { uri, favorites, storeTrack } = this.props
    const isFavorite = favorites.indexOf(uri) > -1

    const { metadata } = claim.value.stream
    const { thumbnail, author, title, description } = metadata
    const artist = author || (certificate ? certificate.name : 'unknown')

    storeTrack(uri, { thumbnail, title, artist, isFavorite, isAvailable: true })

    this.setState({
      isReady: true,
      track: {
        uri,
        title,
        artist,
        thumbnail,
        isFavorite,
      },
    })
  }

  componentDidMount() {
    const { uri, cache, favorites } = this.props
    cache[uri] &&
      this.setState({
        track: {
          ...cache[uri],
          isFavorite: favorites.indexOf(uri) > -1,
        },
        isReady: true,
      })
  }

  componentDidUpdate(prevProps, prevState) {
    const { cache, uri } = this.props
    const prevTrack = prevProps.cache[prevProps.uri] || {}
    const track = cache[uri]
    if (track && track.uri != prevTrack.uri) {
      this.setState({
        track,
        isReady: true,
      })
    }
  }

  render() {
    const { uri } = this.props
    const { isReady, track } = this.state
    const { title, artist, thumbnail, isFavorite } = track || {}

    return (
      <div
        className={css.card + ' ' + (isReady ? '' : css.placeholder)}
        onClick={() => isReady && this.props.play(uri)}
      >
        <Thumbnail className={css.thumb} src={thumbnail} />
        <div className={css.content}>
          <div className={css.metadata}>
            <div className={css.title}>{title}</div>
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
