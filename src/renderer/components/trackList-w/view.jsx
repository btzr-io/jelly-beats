import React from 'react'
import memoize from 'memoize-one'
import Measure from 'react-measure'
import { FixedSizeList as List } from 'react-window'

import RowRenderer from './internal/row'

const ROW_HEIGHT = 50

// Memoized data
const createItemData = memoize((
  // State
  items,
  cache,
  paused,
  downloads,
  favorites,
  currentTrack,
  selectedItems,
  // Actions
  attempPlay,
  doNavigate,
  togglePlay,
  toggleFavorite,
  handleItemChecked
) => ({
  // State
  items,
  cache,
  paused,
  downloads,
  favorites,
  currentTrack,
  selectedItems,
  // Actions
  attempPlay,
  doNavigate,
  togglePlay,
  toggleFavorite,
  handleItemChecked,
}))

class TrackList extends React.PureComponent {
  static defaultProps = {
    type: 'playlist',
    tracks: [],
    playlist: null,
    dimensions: { width: 0, height: 0 },
    selectedItems: {},
  }

  constructor(props) {
    super(props)
    const { tracks } = this.props
    this.state = {
      sortBy: null,
      sortDirection: null,
      currentIndex: 0,
    }
  }

  handleResize = contentRect => {
    console.info(contentRect.bounds)
    this.setState({ dimensions: contentRect.bounds })
  }

  handleItemChecked = (item, checked) => {
    this.setState(prevState => {
      // Previous state
      const selectedItems = { ...prevState.selectedItems }
      // Add item
      if (checked) {
        selectedItems[item] = item
      }
      // Remove item
      if (!checked && selectedItems[item]) {
        delete selectedItems[item]
      }
      // Update items list
      return { selectedItems }
    })
  }

  render() {
    // state
    const { selectedItems, dimensions } = this.state
    // props
    const { cache, tracks, paused, downloads, favorites, currentTrack } = this.props
    // actions
    const { attempPlay, doNavigate, togglePlay, toggleFavorite } = this.props

    // Memoized props
    const data = createItemData(
      // State
      tracks,
      cache,
      paused,
      downloads,
      favorites,
      currentTrack,
      selectedItems,
      // Actions
      attempPlay,
      doNavigate,
      togglePlay,
      toggleFavorite,
      this.handleItemChecked
    )

    // Dimensions
    const { width, height } = dimensions || {}

    return (
      <Measure bounds={true} onResize={this.handleResize}>
        {({ measureRef }) => (
          <div ref={measureRef} className={'table'}>
            <List
              width={width || 0}
              height={height || 0}
              itemSize={ROW_HEIGHT}
              itemData={data}
              itemCount={tracks.length}
            >
              {RowRenderer}
            </List>
          </div>
        )}
      </Measure>
    )
  }
}

export default TrackList
