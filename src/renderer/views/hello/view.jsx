import React from 'react'
import Card from '@/components/card'
import Loader from '@/components/common/loader'
import list from '@/utils/api'
import * as icons from '@/constants/icons'
import Icon from '@mdi/react'
import { Lbry } from 'lbry-redux'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      fetchingData: true,
      feature: [],
    }
  }

  storeMetadata(uri, certificate, claim) {
    const { favorites, storeTrack } = this.props
    const isFavorite = favorites.indexOf(uri) > -1
    const { metadata } = claim.value.stream
    const { thumbnail, author, title, description } = metadata
    const artist = author || (certificate ? certificate.name : 'unknown')
    storeTrack(uri, { thumbnail, title, artist, isFavorite, isAvailable: true })
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
          console.info(res)
          Object.entries(res).map(([uri, value], index) => {
            console.info(index)
            const { claim, certificate } = value
            this.storeMetadata(uri, certificate, claim)
          })

          this.setState({
            fetchingData: false,
          })
        })
        // Handle errors
        .catch(err => {
          this.setState({ fetchingData: false })
        })
    }
  }

  render() {
    const { fetchingData } = this.state
    return (
      <div className="page">
        {!fetchingData ? (
          <div className="grid">
            {list.map((uri, index) => (
              <Card key={uri} uri={uri} index={index} />
            ))}
          </div>
        ) : (
          <Loader icon={icons.SPINNER} animation="spin" />
        )}
      </div>
    )
  }
}

export default View
