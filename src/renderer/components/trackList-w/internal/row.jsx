import React from 'react'
import { connect } from 'unistore/react'
import { areEqual } from 'react-window'
import { memoizeFormatDuration } from '@/utils/formatMediaTime'
import classname from 'classnames'

// React components
import Link from '@/components/common/link'
import Checkbox from '@/components/common/checkbox'
import PriceLabel from '@/components/common/priceLabel'
import FavoriteButton from '@/components/common/favoriteButton'
import RowIndexRenderer from './rowIndexRenderer'

// List row component
const Row = React.memo(({ data, index, style }) => {
  // Props
  const { items, paused, cache, favorites, downloads, currentTrack, selectedItems } = data
  // Actions
  const { attempPlay, doNavigate, togglePlay, toggleFavorite, handleItemChecked } = data
  // Current item
  const item = items[index]
  const formatedIndex = index + 1
  // Cached data
  const claimData = item && cache[item]
  const streamData = item && downloads[item]
  const duration = item && downloads[item] && downloads[item].duration
  const isFavorite = item && favorites.indexOf(item) !== -1
  const isActive = item === currentTrack.uri
  const isSelected = item && selectedItems && selectedItems[item] ? true : false
  const isPlaying = !paused && isActive
  const isDownloading = streamData && streamData.isDownloading
  const streamRequired = !streamData
  // Main button action
  const handlePlay = event => {
    !isPlaying && !isDownloading ? attempPlay(item) : togglePlay()
  }
  // Item selection
  const handleSelect = event => {
    const target = event.target
    target && handleItemChecked(item, target.checked)
  }
  // Render row
  if (claimData) {
    const { channelName, channelUri } = claimData.artist

    const columns = [
      {
        key: 'index',
        width: '32px',
        isAction: true,
        cellRender: (
          <RowIndexRenderer
            index={formatedIndex}
            showIndex={true}
            onClick={handlePlay}
            isActive={isActive}
            isPlaying={isPlaying}
            isDownloading={isDownloading}
            streamRequired={streamRequired}
          />
        ),
      },
      {
        key: 'favorite',
        width: '32px',
        isAction: true,
        cellRender: (
          <FavoriteButton isFavorite={isFavorite} onClick={() => toggleFavorite(item)} />
        ),
      },
      {
        key: 'title',
        width: '300px',
        cellRender: claimData.title,
      },
      {
        key: 'artist',
        width: '124px',
        cellRender: (
          <Link
            label={channelName}
            onClick={() => doNavigate('/profile', { uri: channelUri })}
          />
        ),
      },
      {
        key: 'price',
        width: '80px',
        cellRender: <PriceLabel fee={claimData.fee} />,
      },
      {
        key: 'duration',
        width: '64px',
        cellRender: duration ? memoizeFormatDuration(duration) : '?',
      },
      {
        key: 'selected',
        width: '32px',
        isAction: true,
        cellRender: (
          <Checkbox
            name={'checkbox ' + formatedIndex}
            checked={isSelected}
            onChange={handleSelect}
          />
        ),
      },
    ]

    return (
      <div className={classname('Row', isActive && 'Row--active')} style={style}>
        {columns.map(({ key, width, cellRender, isAction }) => (
          <div
            key={key}
            className={classname('Row__cell', isAction && 'Row__cell--action')}
            style={{ flex: `0 1 ${width}` }}
          >
            {cellRender}
          </div>
        ))}
      </div>
    )
  }

  return null
}, areEqual)

export default Row
