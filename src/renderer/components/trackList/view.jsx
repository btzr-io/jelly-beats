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
    const { player, downloads, setTrack, purchase, togglePlay } = this.props
    //Get player status
    const { paused, isLoading, currentTrack } = player || {}
    //Get stream status
    const { isAvailable, isDownloading } = downloads[uri] || {}
    const shouldTogglePlay = currentTrack ? currentTrack.uri === uri : false
    if (shouldTogglePlay) {
      !isDownloading && !isLoading && togglePlay()
    } else if (uri) {
      setTrack(uri)
      purchase(uri)
    }
  }

  render() {
    const { list, player, favorites, toggleFavorite, doNavigate, downloads } = this.props

    return (
      <table className="track-list">
        <thead>
          <tr>
            <th>#</th>
            <th>{/* Favorite */}</th>
            <th>Track</th>
            <th>Artist</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {list.map(([uri, value], index) => {
            const isFavorite = favorites.indexOf(uri) > -1
            //Get stream status
            const { duration, completed, isAvailable, isDownloading } =
              downloads[uri] || {}
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
                duration={duration}
                isActive={isActive}
                completed={completed}
                isAvailable={isAvailable}
                isDownloading={isDownloading}
                isPlaying={isPlaying}
                isFavorite={isFavorite}
                doNavigate={doNavigate}
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
