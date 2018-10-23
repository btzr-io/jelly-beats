import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import navigate from '@/utils/navigate'
import Button from '@/components/button'
import Health from '@/components/common/health'
import * as icons from '@/constants/icons'

class TrackList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      uri,
      index,
      duration,
      isActive,
      completed,
      isPlaying,
      isFavorite,
      isAvailable,
      triggerPlay,
      isDownloading,
      toggleFavorite,
    } = this.props
    const { certificate, claim } = this.props.claim
    const { metadata } = claim.value.stream
    const { author, title, name, description } = metadata
    const channel = certificate ? certificate.name : 'unknown'

    const artist = author || channel
    const trackTitle = title || name

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
          <span className="row_label">{artist}</span>
        </td>

        <td>
          <span className="row_label">
            {duration && moment.utc(duration * 1000).format('mm:ss')}
          </span>
        </td>
      </tr>
    )
  }
}

export default TrackList
