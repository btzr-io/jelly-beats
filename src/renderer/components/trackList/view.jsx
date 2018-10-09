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
    const { list, player, favorites, toggleFavorite, downloads } = this.props

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
            const isFavorite = favorites.indexOf(uri) > -1
            //Get stream status
            const { completed, isAvailable, isDownloading } = downloads[uri] || {}
            //Get player status
            const { paused, isLoading, currentTrack } = player || {}
            const isActive = currentTrack ? currentTrack.uri === uri : false
            const isPlaying = !paused && isActive

            return (
              <TrackListItem
                key={uri}
                uri={uri}
                index={index + 1}
                claim={value}
                isActive={isActive}
                completed={completed}
                isAvailable={isAvailable}
                isDownloading={isDownloading}
                isPlaying={isPlaying}
                isFavorite={isFavorite}
                triggerPlay={() => this.attempPlay(uri)}
                toggleFavorite={() => toggleFavorite(uri)}
              />
            )
          })}
        </tbody>
      </table>
    )
  }
}

export default TrackList
