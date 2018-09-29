import React from 'react'
import navigate from '@/utils/navigate'
import { Lbry } from 'lbry-redux'

class TrackList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  render() {
    // const { title, artist } = this.props;
    const title = 'Rmix ft. junk stream'
    const artist = '@HeyMattsock12'
    return (
      <div className="track-list">
        <h2 className="track-list__title">New Tracks</h2>
        <div className="item">
          <div className="item__thumbnail" />
          <div className="item__metadata">
            <div className="item__title">{title}</div>
            <div className="item__artist">{artist}</div>
          </div>
        </div>

        <div className="item">
          <div className="item__thumbnail" />
          <div className="item__metadata">
            <div className="item__title">{title}</div>
            <div className="item__artist">{artist}</div>
          </div>
        </div>

        <div className="item">
          <div className="item__thumbnail" />
          <div className="item__metadata">
            <div className="item__title">{title}</div>
            <div className="item__artist">{artist}</div>
          </div>
        </div>

        <div className="item">
          <div className="item__thumbnail" />
          <div className="item__metadata">
            <div className="item__title">{title}</div>
            <div className="item__artist">{artist}</div>
          </div>
        </div>

        <div className="item">
          <div className="item__thumbnail" />
          <div className="item__metadata">
            <div className="item__title">{title}</div>
            <div className="item__artist">{artist}</div>
          </div>
        </div>

        <div className="item">
          <div className="item__thumbnail" />
          <div className="item__metadata">
            <div className="item__title">{title}</div>
            <div className="item__artist">{artist}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default TrackList
