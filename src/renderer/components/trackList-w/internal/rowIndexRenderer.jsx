import React from 'react'
import Button from '@/components/button'

import {
  PLAY as iconPlay,
  PAUSE as iconPause,
  SPINNER as iconSpinner,
  DOWNLOAD as iconDownload,
} from '@/constants/icons'

const RowIndexRenderer = ({
  index,
  onClick,
  showIndex,
  isActive,
  isPlaying,
  isDownloading,
  streamRequired,
}) => {
  // Select icons
  let buttonIcon = isDownloading ? iconSpinner : !isPlaying ? iconPlay : iconPause

  if (streamRequired) {
    buttonIcon = iconDownload
  }

  return (
    <React.Fragment>
      <Button
        icon={buttonIcon}
        type="action--overlay"
        size="large"
        toggle={isPlaying && !isDownloading}
        animation={isDownloading && 'spin'}
        onClick={onClick}
      />
      {showIndex && <span className="table__row__cell--text">{index}</span>}
    </React.Fragment>
  )
}

export default RowIndexRenderer
