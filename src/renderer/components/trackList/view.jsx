import React from 'react'
import navigate from '@/utils/navigate'
import TrackListItem from './trackListItem'

class TrackList extends React.PureComponent {
  static defaultProps = {
    uri: '',
    name: '',
    list: [],
    showHeader: true,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {
      list,
      cache,
      player,
      favorites,
      downloads,
      doNavigate,
      togglePlay,
      attempPlay,
      showHeader,
      toggleFavorite,
    } = this.props

    return (
      <table className="track-list">
        {showHeader && (
          <thead>
            <tr>
              <th>#</th>
              <th>{/* Favorite */}</th>
              <th>Track</th>
              <th>Artist</th>
              <th>Duration</th>
              <th>Price</th>
            </tr>
          </thead>
        )}
        <tbody>
          {list.map((uri, index) => {
            const isFavorite = favorites.indexOf(uri) > -1
            //Get stream status
            const { duration, completed, isAvailable, isDownloading } =
              downloads[uri] || {}
            //Get player status
            const { paused, isLoading, currentTrack } = player || {}
            const isActive =
              completed && (currentTrack ? currentTrack.uri === uri : false)
            const isPlaying = !paused && isActive

            const claim = cache[uri]

            if (isPlaying) {
              const { uri, name, setPlaylist } = this.props
              setPlaylist({ uri, name, index })
            }

            return claim ? (
              <TrackListItem
                key={uri}
                uri={uri}
                index={index + 1}
                claim={claim}
                duration={duration}
                isActive={isActive}
                completed={completed}
                isAvailable={isAvailable}
                isDownloading={isDownloading}
                isPlaying={isPlaying}
                isFavorite={isFavorite}
                doNavigate={doNavigate}
                togglePlay={togglePlay}
                triggerPlay={() => attempPlay(uri, { index })}
                toggleFavorite={() => toggleFavorite(uri)}
              />
            ) : null
          })}
        </tbody>
      </table>
    )
  }
}

export default TrackList
