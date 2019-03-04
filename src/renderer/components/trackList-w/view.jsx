import React from 'react'
import memoize from 'memoize-one'
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
    const { selectedItems } = this.state
    // props
    const { cache, tracks, paused, downloads, favorites, currentTrack } = this.props
    // actions
    const { attempPlay, doNavigate, togglePlay, toggleFavorite } = this.props
    // Memoized props
    const data = createItemData(
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
    return (
      <List
        height={ROW_HEIGHT * 10}
        width={1000}
        itemSize={ROW_HEIGHT}
        itemData={data}
        itemCount={tracks.length}
      >
        {RowRenderer}
      </List>
    )
  }
}

export default TrackList
