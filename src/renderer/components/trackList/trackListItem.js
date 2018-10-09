import React from 'react'
import classnames from 'classnames'
import navigate from '@/utils/navigate'
import Button from '@/components/common/button'
import * as icons from '@/constants/icons'

class TrackList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      uri,
      index,
      triggerPlay,
      toggleFavorite,
      isActive,
      isAvailable,
      isPlaying,
      isDownloading,
      isFavorite,
    } = this.props
    const { certificate, claim } = this.props.claim
    const { metadata } = claim.value.stream
    const { author, title, name, description } = metadata
    const channel = certificate ? certificate.name : 'unknown'

    const artist = author || channel
    const trackTitle = title || name

    const showButton = !isDownloading && !(isAvailable === false)

    return (
      <tr className={classnames('row', { 'row--active': isActive })}>
        <td>
          <div className="row_item">
            {showButton && (
              <Button
                icon={!isPlaying ? icons.PLAY : icons.PAUSE}
                type="table-action--overlay"
                size="large"
                toggle={isPlaying}
                onClick={() => triggerPlay()}
              />
            )}
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
            onClick={() => toggleFavorite()}
          />
        </td>

        <td>
          <span className="row_label">{trackTitle}</span>
        </td>

        <td>
          <span className="row_label">{artist}</span>
        </td>
      </tr>
    )
  }
}

export default TrackList
