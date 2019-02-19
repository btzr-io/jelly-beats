import React from 'react'
import Icon from '@mdi/react'

// Utils
import Lbry from '@/utils/lbry'
import { feature } from '@/utils/api'
import { mergeDedupe } from '@/utils'
import { fetchNewClaims } from '@/utils/chainquery'
import lighthouse from '@/utils/lighthouse'
import fetchChannel from '@/api/channel'

// Components
import Card from '@/components/card'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'

import * as icons from '@/constants/icons'

const searchSettings = {
  size: 50,
  nfsw: false,
  mediaType: 'audio',
}

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      fetchingData: true,
      latest: [],
      results: [],
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

  handleSearchQuery = () => {
    const { searchQuery } = this.props
    this.setState({ fetchingData: true })
    lighthouse
      .search(searchQuery, searchSettings)
      .then(data => {
        const uris = data.map(claim => `${claim.name}#${claim.claimId}`)
        this.fetchData(uris)
      })
      .catch(this.handleFetchError)
  }

  fetchData = uris => {
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
      // Fetch content
      Lbry.resolve({ uris })
        .then(res => {
          const results = Object.entries(res)
            .map(([uri, value], index) => {
              const { claim: claimData, certificate: channelData, error } = value

              // Filter errors
              if (error || !channelData) return null

              // Extract channel data
              channelData && this.getChannelData(channelData)

              // Cache track data
              storeTrack(uri, { channelData, claimData })
              return uri
            })
            .filter(uri => uri !== null)

          // Update state: Done!
          this.setState({
            error: false,
            fetchingData: false,
            results,
          })
        })
        // Handle errors
        .catch(this.handleFetchError)
    }
  }

  componentDidMount() {
    const { connected } = this.props
    if (connected) {
      this.handleSearchQuery()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { connected, searchQuery } = this.props

    // Auto-retry connection
    if (connected === true && connected !== prevProps.connected) {
      // this.fetchData()
    }

    if (connected && searchQuery !== prevProps.searchQuery) {
      this.handleSearchQuery()
    }
  }

  render() {
    const { fetchingData, fetchingLatest, error, errorLatest, results } = this.state
    return (
      <div className="page">
        {!error &&
          (!fetchingData ? (
            <section>
              <h1>Search results</h1>
              <div className="grid">
                {results.map((uri, index) => {
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
