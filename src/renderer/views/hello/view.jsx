import React from 'react'
import Card from '@/components/card'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import list from '@/utils/api'
import * as icons from '@/constants/icons'
import Icon from '@mdi/react'
import { Lbry } from 'lbry-redux'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      fetchingData: true,
      feature: [],
    }
  }

  parseMetadata(uri, certificate, claim) {
    const { favorites, storeTrack } = this.props

    const isFavorite = favorites.indexOf(uri) > -1

    const { txid, nout } = claim

    const { metadata } = claim.value.stream

    const { thumbnail, author, title, description, fee } = metadata

    // Get creator
    const artist = author || (certificate && certificate.name)

    // Generate claim outpoint
    const outpoint = `${txid}:${nout}`

    // Cache data
    storeTrack(uri, {
      fee,
      title,
      artist,
      outpoint,
      thumbnail,
      isFavorite,
      description,
    })
  }

  componentDidMount() {
    // List is empty
    if (list.length === 0) {
      // Stop loading data
      this.setState({ fetchingData: false })
    } else {
      // Resolve uris
      Lbry.resolve({ uris: list })
        .then(res => {
          Object.entries(res).map(([uri, value], index) => {
            const { claim, certificate } = value
            this.parseMetadata(uri, certificate, claim)
          })

          this.setState({
            error: false,
            fetchingData: false,
          })
        })
        // Handle errors
        .catch(err => {
          this.setState({
            error: true,
            fetchingData: false,
          })
        })
    }
  }

  render() {
    const { fetchingData, error } = this.state
    return (
      <div className="page">
        {!error &&
          (!fetchingData ? (
            <div className="grid">
              {list.map((uri, index) => (
                <Card key={uri} uri={uri} index={index} />
              ))}
            </div>
          ) : (
            <Loader icon={icons.SPINNER} animation="spin" />
          ))}
        {error && (
          <EmptyState
            title="Sorry"
            message={
              <p>
                <span>{' We’re having trouble getting awesome content'}</span>
              </p>
            }
          />
        )}
      </div>
    )
  }
}

export default View
