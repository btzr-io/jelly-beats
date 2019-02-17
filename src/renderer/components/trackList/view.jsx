import React from 'react'
import TrackListItem from './trackListItem'
import Icon from '@mdi/react'
import { CLOCK as clock } from '@/constants/icons'

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

    const header = [
      { name: 'index', title: '#' },
      { name: 'favorite', title: '' },
      { name: 'content-type', title: type === 'podcast' ? 'Episode' : 'Track' },
      { name: 'publisher', title: type === 'podcast' ? 'Publiser' : 'Artist' },
      { name: 'price', title: 'Price' },
      { name: 'duration', title: 'Duration' },
    ]

    return (
      <table className="track-list">
        {showHeader && (
          <thead>
            <tr>
              <th>#</th>
              {/* Favorite */}
              <th />
              <th>{type === 'podcast' ? 'Episode' : 'Track'}</th>
              <th>{type === 'podcast' ? 'Publisher' : 'Artist'}</th>
              <th>Price</th>
              {/* Duration */}
              <th>
                <Icon className="icon link__icon" path={clock} />
              </th>
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
