import React from 'react'
import navigate from '@/utils/navigate'
import { Lbry } from 'lbry-redux'
import Button from '@/components/button'
import * as icons from '@/constants/icons'

class TrackList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      metadata: {
        title: '...',
        artist: '...',
      },
    }
  }

  componentDidMount() {
    const { uri } = this.props
    Lbry.resolve({ uri })
      .then(res => {
        const { certificate, claim } = res
        this.getMetadata(certificate, claim)
      })
      .catch(err => {
        // Handle error
      })
  }

  getMetadata(certificate, claim) {
    const { metadata } = claim.value.stream
    const { author, title, name, description } = metadata
    const channel = certificate ? certificate.name : 'unknown'
    console.info(channel)
    this.setState({
      ready: true,
      metadata: {
        title: title || name,
        artist: author || channel,
      },
    })
  }

  render() {
    const { index } = this.props
    const { artist, title } = this.state.metadata
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
          <span className="row_label">{title}</span>
        </td>

        <td>
          <span className="row_label">{artist}</span>
        </td>

        <td>
          <span className="row_label">...</span>
        </td>
      </tr>
    )
  }
}

export default TrackList
