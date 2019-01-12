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
      errorLatest: false,
      fetchingData: true,
      fetchingLatest: true,
      latest: [],
      feature: [],
    }
  }

  parseMetadata(uri, { channelData, claimData }) {
    const { favorites, storeTrack } = this.props

    // Extract metadata:
    // If uri is missing from args it means that claimData and ChannelData
    // is coming from chainquery and has a different structure.
    const metadata = !uri && claimData ? claimData : claimData.value.stream.metadata
    const { author, title, name, description, fee } = metadata
    const thumbnail = metadata.thumbnail || metadata.thumbnail_url

    // Channel
    const artist = {
      channelUri: null,
      channelName: author,
    }

    let outpoint = null
    let claimUri = uri

    // Chainquery
    if (!claimUri) {
      // Block claims (Remove this):
      // if (!thumbnail || (fee && (fee.amount > 0 || fee > 0))) return false
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

        // Featured content
        Lbry.resolve({ uris: latestUris })
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

              // Update state: Done!
              this.setState(prevState => ({
                latest: [...prevState.latest, uri],
              }))
            })

            // Update state: Done!
            this.setState({
              errorLatest: false,
              fetchingLatest: false,
            })
          })

          // Handle errors
          .catch(err => {
            console.info(this.state.latest, err)
            this.setState({
              errorLatest: true,
              fetchingLatest: false,
            })
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
    const { fetchingData, fetchingLatest, error, errorLatest, latest } = this.state
    return (
      <div className="page">
        {!errorLatest &&
          (!fetchingLatest ? (
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
        {error && errorLatest && (
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
