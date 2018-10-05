import React from 'react'
import navigate from '@/utils/navigate'
import Button from '@/components/common/button'
import * as icons from '@/constants/icons'

class TrackList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { index } = this.props
    const { certificate, claim } = this.props.claim
    const { metadata } = claim.value.stream
    const { author, title, name, description } = metadata
    const channel = certificate ? certificate.name : 'unknown'

    const artist = author || channel
    const trackTitle = title || name

    return (
      <tr>
        <td>
          <div className="row_item">
            <Button
              icon={icons.PLAY}
              type="table-action--overlay"
              size="large"
              toggle={index === 1}
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
