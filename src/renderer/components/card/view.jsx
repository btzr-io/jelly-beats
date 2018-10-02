import React from 'react'
import Tags from '@/components/tags'
import Button from '@/components/button'
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
      metadata: null,
      favorite: false,
    }
  }

  toggleFavorite = () => {
    const { addToFavorites, removefromFavorites, uri } = this.props
    this.setState(prevState => {
      !prevState.favorite ? addToFavorites(uri) : removefromFavorites(uri)

      return { favorite: !prevState.favorite }
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
    const channel = certificate ? certificate.name : 'unknown'
    const tags = getTags(description) || []

    this.setState({
      ready: true,
      favorite: isFavorite,
      metadata: {
        title,
        tags,
        author: author || channel,
        thumbnail,
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
    const { ready, metadata, favorite } = this.state

    return (
      <div className={css.card + ' ' + (ready ? '' : css.placeholder)}>
        <Thumbnail className={css.thumb} src={metadata ? metadata.thumbnail : null} />
        <div className={css.content}>
          <div className={css.metadata}>
            <div className={css.title}>{metadata ? metadata.title : ''}</div>
            <div className={css.subtitle}>{metadata ? metadata.author : ''}</div>
          </div>
          <div className={css.actions}>
            <Button
              toggle={favorite}
              iconColor={favorite ? 'var(--color-red)' : ''}
              icon={favorite ? icons.HEART : icons.HEART_OUTLINE}
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
