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
    const { list, type, doNavigate, showHeader, playlist } = this.props

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
              <TrackListItem
                key={uri}
                uri={uri}
                index={index + 1}
                playlist={playlist}
                /*
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
                storePalette={storePalette}
                triggerPlay={() => attempPlay(uri, { index })}
                toggleFavorite={() => toggleFavorite(uri)}
                */
              />
            ) : null
          })}
        </tbody>
      </table>
    )
  }
}

export default TrackList
