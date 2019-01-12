import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import navigate from '@/utils/navigate'
import Button from '@/components/button'
import Health from '@/components/common/health'
import * as icons from '@/constants/icons'

class TrackListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      uri,
      index,
      claim,
      duration,
      isActive,
      completed,
      isPlaying,
      isFavorite,
      isAvailable,
      doNavigate,
      triggerPlay,
      isDownloading,
      toggleFavorite,
    } = this.props

    const { artist, title } = claim
    const trackTitle = title

    const disabled = isAvailable === false
    const buttonIcon = isDownloading
      ? icons.SPINNER
      : !isPlaying
      ? icons.PLAY
      : icons.PAUSE

    return (
      <tr
        className={classnames('row', {
          'row--active': isActive,
          'row--busy': isDownloading,
          'row--disabled': disabled,
        })}
      >
        <td>
          <div className="row_item">
            <Button
              icon={buttonIcon}
              type="table-action--overlay"
              size="large"
              toggle={isPlaying && !isDownloading}
              animation={isDownloading && 'spin'}
              onClick={() => !isDownloading && triggerPlay()}
            />
            <span className="row_label">{index}</span>
          </div>
        </td>

        <td>
          <Button
            iconColor={isFavorite ? 'var(--color-red)' : ''}
            icon={isFavorite ? icons.HEART : icons.HEART_OUTLINE}
            type="table-action"
            size="large"
            toggle={isFavorite}
            tooltip={{ text: `${isFavorite ? 'Remove from' : 'Add to'} favorites` }}
            onClick={() => toggleFavorite()}
          />
        </td>

        <td>
          <span
            className="row_label row_label--link"
            onClick={() => !isDownloading && triggerPlay()}
          >
            <Health status={{ completed, isAvailable, isDownloading }} />
            {trackTitle}
          </span>
        </td>

        <td>
          {artist && (
            <span
              className="row_label"
              onClick={() => doNavigate('/profile', { uri: artist.channelUri })}
            >
              {artist.channelName}
            </span>
          )}
        </td>

        <td>
          <span className="row_label">
            {duration ? moment.utc(duration * 1000).format('mm:ss') : 'N / A'}
          </span>
        </td>
      </tr>
    )
  }
}

export default TrackListItem
