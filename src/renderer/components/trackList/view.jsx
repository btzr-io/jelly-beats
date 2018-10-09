import React from 'react'
import navigate from '@/utils/navigate'
import TrackListItem from './trackListItem'

class TrackList extends React.PureComponent {
  static defaultProps = {
    list: [],
  }

  constructor(props) {
    super(props)
  }

  attempPlay = uri => {
    const { setTrack, purchase } = this.props
    setTrack(uri)
    purchase(uri)
  }

  render() {
    const { list, player } = this.props
    const { currentTrack, isLoading, paused } = player || {}
    const isPlaying = !paused && !isLoading

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
          {list.map(([uri, value], index) => {
            const isActive = currentTrack ? currentTrack.uri === uri : false
            return (
              <TrackListItem
                key={uri}
                uri={uri}
                index={index + 1}
                claim={value}
                active={isActive}
                isLoading={isLoading}
                isPlaying={isPlaying && isActive}
                onClick={() => this.attempPlay(uri)}
              />
            )
          })}
        </tbody>
      </table>
    )
  }
}

export default TrackList
