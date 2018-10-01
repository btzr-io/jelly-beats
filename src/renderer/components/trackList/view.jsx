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
    this.state = {
      currentList: {},
    }
  }

  componentDidMount() {
    Lbry.resolve({ uris: this.props.list })
      .then(res => {
        this.setState({ currentList: res })
      })
      .catch(err => {
        // Handle error
      })
  }

  render() {
    const { currentList } = this.state
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
          {Object.entries(currentList).map(([key, value], index) => (
            <TrackListItem key={key} uri={key} claim={value} index={index + 1} />
          ))}
        </tbody>
      </table>
    )
  }
}

export default TrackList
