import React from 'react'
import * as icons from '@/constants/icons'
import Thumbnail from '@/components/common/thumbnail'
import EmptyState from '@/components/common/emptyState'

import { fetchClaimsCountByChannel } from '@/utils/chainquery'

class TiledCard extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      count: null,
    }
  }

  componentDidMount() {
    const { id } = this.props

    fetchClaimsCountByChannel(id, { limit: 100, page: 0 })
      .then(res => {
        this.setState({ count: res[0]['COUNT(*)'] })
      })
      .catch(error => {
        console.error(error)
      })
  }

  handleAction = () => {
    const { uri, action } = this.props
    action(uri)
  }

  render() {
    const { count } = this.state
    const { title, host, thumbnail } = this.props

    return (
      <div className="tile-card">
        <Thumbnail className="tile-card--thumbnail" src={thumbnail} />
        <div className="tile-card--content">
          <div className="tile-card--title label-link" onClick={this.handleAction}>
            {title}
          </div>
          <div className="tile-card--subtitle">
            <span>{host}</span>
            <span>•</span>
            <span>{count ? `${count} episodes` : '?'}</span>
          </div>
        </div>
      </div>
    )
  }
}

class View extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  navigate = uri => {
    this.props.doNavigate('/podcast', { uri })
  }

  render() {
    const { podcasts } = this.props
    const podcastsList = Object.entries(podcasts)
    const content =
      podcastsList && podcastsList.length > 0 ? (
        <section>
          <header>
            <h1>Podcasts</h1>
            <div className={'stats'}>
              <span className={'label label-outline'}>BETA</span>
              <span>•</span>
              <span>{`${podcastsList.length} shows`}</span>
            </div>
          </header>
          {podcastsList.map(([uri, value]) => (
            <TiledCard {...value} key={uri} action={this.navigate} />
          ))}
        </section>
      ) : (
        <EmptyState title="No podcasts yet?" message="( Coming soon )" />
      )
    return <div className="page">{content}</div>
  }
}

export default View
