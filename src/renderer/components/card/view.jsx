import React from 'react'
import navigate from '@/utils/navigate'
import Tags from '@/components/tags'
import Icon from '@mdi/react'
import css from '@/css/modules/card.css.module'
import Thumbnail from './thumbnail'
import { Lbry } from 'lbry-redux'
import { getTags } from '@/utils/tags'

import { mdiPlaylistPlus, mdiHeartOutline, mdiDotsVertical } from '@mdi/js'

class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      metadata: null,
    }
  }

  handleClick() {
    const { uri } = this.props
    const { metadata } = this.state
    navigate('/track', { uri, metadata })
  }

  getMetadata(certificate, claim) {
    const { metadata } = claim.value.stream
    const { thumbnail, author, title, description } = metadata
    const channel = certificate ? certificate.name : 'unknown'
    const tags = getTags(description) || []
    this.setState({
      ready: true,
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
    const { ready, metadata } = this.state

    const Content = ({ metadata }) => {
      return (
        <div
          className={css.card + ' ' + (ready ? '' : css.placeholder)}
          onClick={this.handleClick.bind(this)}
        >
          <Thumbnail className={css.thumb} src={metadata ? metadata.thumbnail : null} />
          <div className={css.title}>{metadata ? metadata.title : ''}</div>
          <div className={css.subtitle}>{metadata ? metadata.author : ''}</div>
          <div className={css.actions}>
            <div className={css.action}>
              <Icon
                className={css.icon}
                path={mdiHeartOutline}
                size={0.85}
                color={'#FFFFFF'}
              />
            </div>
            <div className={css.action}>
              <Icon
                className={css.icon}
                path={mdiPlaylistPlus}
                size={0.85}
                color={'#FFFFFF'}
              />
            </div>
          </div>
        </div>
      )
    }

    return <Content metadata={metadata} />
  }
}

export default Card
