import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import navigate from '@/utils/navigate'
import Button from '@/components/button'
import Health from '@/components/common/health'
import * as icons from '@/constants/icons'

// import worker bundle
import Vibrant from 'node-vibrant/lib/bundle-worker'

class TrackListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  getPalette(src) {
    // Adaptive UI
    const { storePalette, uri } = this.props
    src &&
      Vibrant.from(src)
        .quality(5)
        .maxColorCount(32)
        .getPalette()
        .then(palette => {
          storePalette(uri, palette.Vibrant.hex)
        })
  }

  componentDidMount() {
    const { uri, claim } = this.props
    claim && this.getPalette(claim.thumbnail)
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
      togglePlay,
      isDownloading,
      toggleFavorite,
    } = this.props

    const { artist, title, fee } = claim

    const disabled = isAvailable === false

    const shouldPurchase = !isDownloading && !completed

    let buttonIcon = isDownloading ? icons.SPINNER : !isPlaying ? icons.PLAY : icons.PAUSE

    if (shouldPurchase) {
      buttonIcon = icons.DOWNLOAD
    }

    const price = fee && `${fee.amount.toFixed(2)} ${fee.currency}`

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
              onClick={() => {
                !isPlaying && !isDownloading ? triggerPlay() : togglePlay()
              }}
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
            // TODO: FIX IT!
            // tooltip={{ text: `${isFavorite ? 'Remove from' : 'Add to'} favorites` }}
            onClick={() => toggleFavorite()}
          />
        </td>

        <td>
          <span
            className="row_label row_label--link trunk-label"
            onClick={() => !shouldPurchase && triggerPlay()}
          >
            <Health status={{ completed, isAvailable, isDownloading }} />
            {title}
          </span>
        </td>

        <td>
          {artist && (
            <span
              className="row_label row_label--link"
              onClick={() => doNavigate('/profile', { uri: artist.channelUri })}
            >
              {artist.channelName}
            </span>
          )}
        </td>

        <td>
          <span className="row_label">
            {duration ? moment.utc(duration * 1000).format('mm:ss') : '?'}
          </span>
        </td>

        <td>
          <span
            className={classnames('row_label', 'price_label', {
              'price_label--free': !fee,
            })}
          >
            {price || 'FREE'}
          </span>
        </td>
      </tr>
    )
  }
}

export default TrackListItem
