import React from 'react'
import navigate from '@/utils/navigate'
import TrackListItem from './trackListItem'

class TrackList extends React.Component {
  static defaultProps = {
    list: [],
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { list } = this.props
    return (
      <table className="track-list">
        <thead>
          <tr>
            <th>#</th>
            <th>{/* Favorite */}</th>
            <th>Track</th>
            <th>Artist</th>
          </tr>
        </thead>
        <tbody>
          {list.map(([key, value], index) => (
            <TrackListItem key={key} uri={key} claim={value} index={index + 1} />
          ))}
        </tbody>
      </table>
    )
  }
}

export default TrackList
