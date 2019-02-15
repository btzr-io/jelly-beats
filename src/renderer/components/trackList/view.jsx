import React from 'react'
import TrackListItem from './trackListItem'

class TrackList extends React.PureComponent {
  static defaultProps = {
    name: '',
    list: [],
    type: 'playlist',
    playlist: null,
    showHeader: true,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { list, type, showHeader, playlist } = this.props

    return (
      <table className="track-list">
        {showHeader && (
          <thead>
            <tr>
              <th>#</th>
              <th>{/* Favorite */}</th>
              <th>{type === 'podcast' ? 'Episode' : 'Track'}</th>
              <th>{type === 'podcast' ? 'Publisher' : 'Artist'}</th>
              <th>Duration</th>
              <th>Price</th>
            </tr>
          </thead>
        )}
        <tbody>
          {list.map((uri, index) => {
            return uri ? (
              <TrackListItem key={uri} uri={uri} index={index} playlist={playlist} />
            ) : null
          })}
        </tbody>
      </table>
    )
  }
}

export default TrackList
