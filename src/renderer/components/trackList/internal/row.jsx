import React from 'react'
import { connect } from 'unistore/react'
import { areEqual } from 'react-window'
import { memoizeFormatDuration } from '@/utils/formatMediaTime'
import clsx from 'clsx'

// React components
import Link from '@/components/common/link'
import Checkbox from '@/components/common/checkbox'
import PriceLabel from '@/components/common/priceLabel'
import OptionsButton from '@/components/common/optionsButton'
import DownloadButton from '@/components/common/downloadButton'
import FavoriteButton from '@/components/common/favoriteButton'
import RowIndexRenderer from './rowIndexRenderer'

// List row component
const Row = React.memo(({ data, index, style }) => {
  // Props
  const {
    cache,
    items,
    paused,
    loading,
    streams,
    downloads,
    favorites,
    currentTrack,
    selectedItems,
  } = data
  // Actions
  const { attempPlay, doNavigate, togglePlay, toggleFavorite, handleItemChecked } = data
  // Current item
  const item = items[index]
  const formatedIndex = index + 1
  // Cached data
  const claimData = item && cache[item]
  const streamSource = streams[item]
  const fileSource = item && downloads.find(download => download.uri === item)
  const { duration, completed, isDownloading } = fileSource || {}
  const isFavorite = item && favorites.indexOf(item) !== -1
  const isActive = (completed || streamSource) && currentTrack.uri === item
  const isSelected = item && selectedItems && selectedItems[item] ? true : false
  const isPlaying = !paused && isActive
  const isLoading =
    (isActive && loading) || isDownloading || (streamSource && !streamSource.ready)

  // Main button action
  const handlePlay = () => {
    // Toggle play or purchase
    if (isActive && !isLoading) {
      togglePlay()
    } else if (!isLoading && !isPlaying) {
      attempPlay(item, null)
    }
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
        dataKey: 'index',
        width: '32px',
        isAction: true,
        cellRender: (
          <RowIndexRenderer
            index={formatedIndex}
            showIndex={true}
            onClick={handlePlay}
            isActive={isActive}
            isPlaying={isPlaying}
            isLoading={isLoading}
            isDownloading={isDownloading}
          />
        ),
      },
      {
        dataKey: 'favorite',
        width: '32px',
        isAction: true,
        cellRender: (
          <FavoriteButton isFavorite={isFavorite} onClick={() => toggleFavorite(item)} />
        ),
      },
      {
        dataKey: 'title',
        width: '300px',
        cellRender: claimData.title,
      },
      {
        dataKey: 'artist',
        width: '124px',
        cellRender: (
          <Link
            label={channelName}
            onClick={() => doNavigate('/profile', { uri: channelUri })}
          />
        ),
      },
      {
        dataKey: 'price',
        width: '80px',
        cellRender: <PriceLabel fee={claimData.fee} />,
      },
      {
        dataKey: 'duration',
        width: '64px',
        cellRender: duration ? memoizeFormatDuration(duration) : '?',
      },
      {
        dataKey: 'selected',
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
      <div
        className={clsx('Row', isActive && 'Row--active', isLoading && 'Row--busy')}
        style={style}
      >
        {columns.map(({ dataKey, width, cellRender, isAction }) => (
          <div
            key={dataKey}
            className={clsx('Row__cell', isAction && 'Row__cell--action')}
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
