import React from 'react'
import Icon from '@mdi/react'
import * as icons from '@/constants/icons'
import list from '@/utils/api'
import { fetchNewClaims } from '@/utils/chainquery'
import fetchChannel from '@/api/channel'
import Card from '@/components/card'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import { Lbry } from 'lbry-redux'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      fetchingData: true,
      latest: [],
      feature: [],
    }
  }

  parseMetadata(uri, { channelData, claimData }) {
    const { favorites, storeTrack } = this.props
    const { txid, nout, value } = claimData

    // Extract metadata
    const metadata = value.stream.metadata
    const { fee, name, title, author, thumbnail, description } = metadata

    // Generate claim outpoint
    const outpoint = `${txid}:${nout}`

    // Channel
    const artist = {
      channelUri: null,
      channelName: author,
    }

    // Get creator
    if (channelData) {
      artist.channelUri = channelData.permanent_url
      artist.channelName = channelData.name
    }

    // Check if claim is marked as favorite
    const isFavorite = uri && favorites && favorites.indexOf(uri) > -1

    // Cache data
    storeTrack(uri, {
      fee,
      title: title || name,
      artist,
      outpoint,
      thumbnail,
      isFavorite,
      description,
    })
  }

  getChannelData(claim) {
    const { storeChannel } = this.props

    fetchChannel(claim, channel => {
      storeChannel(channel)
    })
  }

  componentDidMount() {
    // List is empty
    if (list.length === 0) {
      // Stop loading data
      this.setState({ fetchingData: false })
    } else {
      // Latest content
      fetchNewClaims({ limit: 10, page: 0 }).then(res => {
        const latestUris = res.map(claimData => `${claimData.name}#${claimData.claim_id}`)
        // Update state: Done!
        this.setState(prevState => ({ latest: [...prevState.latest, ...latestUris] }))

        // Featured content
        Lbry.resolve({ uris: [...list, ...latestUris] })
          .then(res => {
            Object.entries(res).map(([uri, value], index) => {
              const { claim, certificate, error } = value

              // Filter errors
              if (error || !certificate) return null

              // Extract channel data
              certificate && this.getChannelData(certificate)

              // Extract data and cache data from claim
              this.parseMetadata(uri, {
                channelData: certificate,
                claimData: claim,
              })
            })
            // Update state: Done!
            this.setState({
              error: false,
              fetchingData: false,
            })
          })
          // Handle errors
          .catch(err => {
            console.error(err)
            this.setState({
              error: true,
              fetchingData: false,
            })
          })
      })
    }
  }

  render() {
    const { fetchingData, fetchingLatest, error, errorLatest, latest } = this.state
    return (
      <div className="page">
        {!error &&
          (!fetchingData ? (
            <section>
              <h1>Latest</h1>
              <div className="grid">
                {latest.map((uri, index) => (
                  <Card key={uri} uri={uri} index={index} />
                ))}
              </div>
            </section>
          ) : null)}
        {!error &&
          (!fetchingData ? (
            <section>
              <h1>Featured</h1>
              <div className="grid">
                {list.map((uri, index) => (
                  <Card key={uri} uri={uri} index={index} />
                ))}
              </div>
            </section>
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
