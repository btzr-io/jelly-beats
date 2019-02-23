import React from 'react'
import Icon from '@mdi/react'

// Utils
import Lbry from '@/utils/lbry'
import { feature } from '@/utils/api'
import { mergeDedupe } from '@/utils'
import { fetchNewClaims } from '@/utils/chainquery'
import fetchChannel from '@/api/channel'

// Components
import Card from '@/components/card'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'

import * as icons from '@/constants/icons'

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

  getChannelData(claim) {
    const { cache, storeChannel } = this.props
    const { permanent_url: uri } = claim
    if (!cache[uri]) {
      fetchChannel(claim, channel => {
        storeChannel(channel)
      })
    }
  }

  handleFetchError = error => {
    console.error(error)
    // Deamon has stop running
    this.setState({ error: true, fetchingData: false })
  }

  fetchData = () => {
    const { storeTrack, storePlaylist, network, cache } = this.props
    const { isReady, connection } = network
    // Update status
    this.setState({ fetchingData: true })
    // Attemp to fetch
    if (!connection.code || connection.code === 'connecting') {
      // Retry fetch
      setTimeout(() => this.fetchData(), 2500)
    } else if (connection.code === 'disconnected') {
      // Deamon has stop running
      this.handleFetchError()
    } else if (isReady) {
      // Latest content
      fetchNewClaims({ limit: 6, page: 0 })
        .then(res => {
          const latestCached = []
          const featureCached = []

          const latestUris = res.map(
            claimData => `${claimData.name}#${claimData.claim_id}`
          )

          // Filter cached claims
          const urls = mergeDedupe([latestUris, feature])

          // Featured content
          Lbry.resolve({ urls })
            .then(res => {
              const resolvedUris = Object.entries(res)
                .map(([uri, value], index) => {
                  const { claim: claimData, certificate: channelData, error } = value

                  // Filter errors
                  if (error || !channelData) return

                  // Extract channel data
                  channelData && this.getChannelData(channelData)

                  // Cache track data
                  storeTrack(uri, { channelData, claimData })
                  return uri
                })
                .filter(uri => uri !== null)

              const latestResolved = latestUris.filter(
                uri => resolvedUris.indexOf(uri) !== -1
              )

              const featureResolved = feature.filter(
                uri => resolvedUris.indexOf(uri) !== -1
              )

              // Store latest playlist
              storePlaylist('latest', { name: 'Latest', list: latestResolved })
              this.setState({ latest: latestResolved })

              // Store latest playlist
              storePlaylist('featured', { name: 'Featured', list: featureResolved })
              this.setState({ feature: featureResolved })

              // Update state: Done!
              this.setState({
                error: false,
                fetchingData: false,
              })
            })
            // Handle errors
            .catch(this.handleFetchError)
        })
        // Handle errors
        .catch(this.handleFetchError)
    }
  }

  componentDidMount() {
    const { connected } = this.props
    if (connected) {
      this.fetchData()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { connected } = this.props

    // Auto-retry connection
    if (connected === true && connected !== prevProps.connected) {
      this.fetchData()
    }
  }

  render() {
    const {
      fetchingData,
      fetchingLatest,
      error,
      errorLatest,
      latest,
      feature,
    } = this.state
    return (
      <div className="page">
        {!error &&
          (!fetchingData ? (
            <section>
              <h1>Latest</h1>
              <div className="grid">
                {latest.map((uri, index) => {
                  return (
                    <Card
                      key={uri}
                      uri={uri}
                      index={index}
                      playlist={{ uri: 'latest', name: 'Latest' }}
                    />
                  )
                })}
              </div>
            </section>
          ) : null)}
        {!error &&
          (!fetchingData ? (
            <section>
              <h1>Featured</h1>
              <div className="grid">
                {feature.map((uri, index) => (
                  <Card
                    key={uri}
                    uri={uri}
                    index={index}
                    playlist={{ uri: 'featured', name: 'Featured' }}
                  />
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
