import React from 'react'
import memoize from 'memoize-one'
import Measure from 'react-measure'
import Icon from '@mdi/react'
import { FixedSizeList as List } from 'react-window'

import Checkbox from '@/components/common/checkbox'
import RowRenderer from './internal/row'
import HeaderColumn from './internal/headerColumn'
import * as SortDirection from '@/constants/sortDirection'
import { HASH as iconHash, CLOCK as iconClock } from '@/constants/icons'

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
    // Playlist
    type: 'playlist',
    tracks: [],
    playlist: null,
    // Measure
    dimensions: { width: 0, height: 0 },
  }

  constructor(props) {
    super(props)
    const { tracks } = this.props
    this.state = {
      // Sort
      sortBy: null,
      sortDirection: null,
      // Edit
      selectedItems: {},
      editModeEnabled: false,
      allItemsSelected: false,
      // Scroll
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

  handleAllItemsChecked = event => {
    const { tracks } = this.props
    const { checked } = event.target

    this.setState(prevState => {
      // Clear all items
      const selectedItems = {}
      // Add All items
      if (checked) {
        tracks.map(item => {
          selectedItems[item] = item
        })
      }
      // Update items list
      return { selectedItems, allItemsSelected: checked }
    })
  }

  handleSort = sortBy => {
    let sortDirection
    this.setState(prevState => {
      if (prevState.sortBy !== sortBy) {
        // Ascending order
        sortDirection = SortDirection.ASC
      } else if (prevState.sortDirection == SortDirection.ASC) {
        // Descending order
        sortDirection = SortDirection.DESC
      } else if (prevState.sortDirection == SortDirection.DESC) {
        // Natural sort order
        return { sortBy: null, sortDirection: null }
      }
      // Update state
      return { sortBy, sortDirection }
    })
  }

  render() {
    // state
    const {
      dimensions,
      selectedItems,
      allItemsSelected,
      sortBy,
      sortDirection,
    } = this.state
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

    // Header columns
    const columns = [
      {
        dataKey: 'index',
        width: '32px',
        isAction: true,
        disabledSort: true,
        cellRender: <Icon className="icon link__icon" path={iconHash} />,
      },
      {
        dataKey: 'favorite',
        width: '32px',
        isAction: true,
        cellRender: null,
        disabledSort: true,
      },
      {
        dataKey: 'title',
        width: '300px',
        cellRender: 'Title',
      },
      {
        dataKey: 'artist',
        width: '124px',
        cellRender: 'Artist',
      },
      {
        dataKey: 'price',
        width: '80px',
        cellRender: 'Price',
      },
      {
        dataKey: 'duration',
        width: '64px',
        cellRender: <Icon className="icon link__icon" path={iconClock} />,
      },
      {
        dataKey: 'selected',
        width: '32px',
        isAction: true,
        disabledSort: true,
        cellRender: (
          <Checkbox
            name={'checkbox'}
            checked={allItemsSelected}
            onChange={this.handleAllItemsChecked}
          />
        ),
      },
    ]

    // Dimensions
    const { width, height } = dimensions || {}

    return (
      <Measure bounds={true} onResize={this.handleResize}>
        {({ measureRef }) => (
          <div className={'Table'}>
            <div className={'Row Row--header'} style={{ height: ROW_HEIGHT }}>
              {columns.map(columnProps => (
                <HeaderColumn
                  key={columnProps.dataKey}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSort={this.handleSort}
                  {...columnProps}
                />
              ))}
            </div>
            <div
              ref={measureRef}
              className={'Rows-container'}
              style={{ top: ROW_HEIGHT }}
            >
              <List
                width={width || 0}
                height={height || 0}
                itemSize={ROW_HEIGHT}
                itemData={data}
                itemCount={tracks.length}
                className={'Rows'}
              >
                {RowRenderer}
              </List>
            </div>
          </div>
        )}
      </Measure>
    )
  }
}

export default TrackList
