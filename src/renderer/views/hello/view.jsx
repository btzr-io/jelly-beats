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

    let outpoint = null
    let claimUri = uri

    // Extract metadata:
    // If uri is missing from args it means that claimData and ChannelData
    // is coming from chainquery and has a different structure.

    const metadata = !claimUri ? claimData : claimData.value.stream.metadata
    const { author, title, name, description, fee } = metadata
    const thumbnail = metadata.thumbnail || metadata.thumbnail_url

    // Get creator
    const artist = {
      channelUri: null,
      channelName: author,
    }

    // Chainquery
    if (!claimUri) {
      // Block claims (Remove this):
      // - Not free
      // - Withouth thumbnails
      if (!thumbnail || (fee && (fee.amount > 0 || fee > 0))) return false

      const { claim_id, vout: nout, transaction_hash_id: txid } = claimData

      // Generate claim uri
      claimUri = name + '#' + claim_id

      // Generate claim outpoint
      outpoint = `${txid}:${nout}`

      // Get creator
      if (channelData) {
        artist.channelUri = channelData.uri
        artist.channelName = channelData.nickname
      }
    } else {
      // Generate claim outpoint
      const { txid, nout } = claimData
      outpoint = `${txid}:${nout}`

      // Get creator
      if (channelData) {
        artist.channelUri = channelData.permanent_url
        artist.channelName = channelData.name
      }
    }

    // Check if claim is marked as favorite
    const isFavorite = claimUri && favorites && favorites.indexOf(claimUri) > -1

    // Cache data
    storeTrack(claimUri, {
      fee: fee || 0,
      title: title || name,
      artist,
      outpoint,
      thumbnail,
      isFavorite,
      description,
    })

    // TODO: REMOVE THIS!
    !uri &&
      this.setState(prevState => ({
        latest: [...prevState.latest, claimUri],
      }))
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
        console.info(res)
        res.map(claimData => {
          this.parseMetadata(null, { claimData })
        })
      })
      // Featured content
      Lbry.resolve({ uris: list })
        .then(res => {
          Object.entries(res).map(([uri, value], index) => {
            const { claim, certificate } = value
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
          this.setState({
            error: true,
            fetchingData: false,
          })
        })
    }
  }

  render() {
    const { fetchingData, error, latest } = this.state
    return (
      <div className="page">
        {!error &&
          (!fetchingData && latest && latest.length ? (
            <section>
              <h1>Latest</h1>
              <div className="grid">
                {latest.map((uri, index) => (
                  <Card key={uri} uri={uri} index={index} />
                ))}
              </div>
            </section>
          ) : (
            <Loader icon={icons.SPINNER} animation="spin" />
          ))}
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
