import React from 'react'
import navigate from '@/utils/navigate'
import { Lbry } from 'lbry-redux'
import Button from '@/components/button'
import * as icons from '@/constants/icons'
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
            <th>{/* Favorites */}</th>
            <th>Track</th>
            <th>Artist</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {list.map((uri, index) => (
            <TrackListItem uri={uri} index={index + 1} key={uri} />
          ))}
        </tbody>
      </table>
    )
  }
}

export default TrackList
