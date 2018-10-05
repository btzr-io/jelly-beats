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
      ready: false,
      track: {},
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
    const { uri, favorites } = this.props
    const isFavorite = favorites.indexOf(uri) > -1

    const { metadata } = claim.value.stream
    const { thumbnail, author, title, description } = metadata
    const artist = author || (certificate ? certificate.name : 'unknown')
    // const tags = getTags(description) || []

    this.setState({
      ready: true,
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
    const { uri } = this.props
    Lbry.resolve({ uri })
      .then(res => {
        const { certificate, claim } = res
        this.getMetadata(certificate, claim)
      })
      .catch(err => {
        // Handle error
      })
  }

  render() {
    const { ready, track } = this.state
    const { title, artist, thumbnail, isFavorite } = track || {}
    return (
      <div
        className={css.card + ' ' + (ready ? '' : css.placeholder)}
        onClick={() => ready && this.props.play(track)}
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
