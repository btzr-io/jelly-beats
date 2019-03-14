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
  isLoading,
  isDownloading,
}) => {
  // Select icons
  let buttonIcon = isLoading ? iconSpinner : !isPlaying ? iconPlay : iconPause
  /*
  if (downloadRequired) {
    buttonIcon = iconDownload
  }
  */

  return (
    <React.Fragment>
      <Button
        icon={buttonIcon}
        type="action--overlay"
        size="large"
        toggle={isPlaying && !isLoading}
        animation={isLoading && 'spin'}
        onClick={onClick}
      />
      {showIndex && <span className="table__row__cell--text">{index}</span>}
    </React.Fragment>
  )
}

export default RowIndexRenderer
