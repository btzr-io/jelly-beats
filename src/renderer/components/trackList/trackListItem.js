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
    const { index, active, onClick, isPlaying, isLoading } = this.props
    const { certificate, claim } = this.props.claim
    const { metadata } = claim.value.stream
    const { author, title, name, description } = metadata
    const channel = certificate ? certificate.name : 'unknown'

    const artist = author || channel
    const trackTitle = title || name

    return (
      <tr
        className={classnames('row', { 'row--active': active })}
        onClick={() => onClick()}
      >
        <td>
          <div className="row_item">
            <Button
              icon={!isPlaying ? icons.PLAY : icons.PAUSE}
              type="table-action--overlay"
              size="large"
              toggle={isPlaying}
            />
            <span className="row_label">{index}</span>
          </div>
        </td>

        <td>
          <Button
            iconColor={'var(--color-red)'}
            icon={icons.HEART}
            type="table-action"
            size="large"
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
