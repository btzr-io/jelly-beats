import React from 'react'
import Icon from '@mdi/react'
import * as icons from '@/constants/icons'
import list from '@/utils/api'
import { fetchNewClaims } from '@/utils/chainquery'
import fetchChannel from '@/api/channel'
import Card from '@/components/card'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import Lbry from '@/utils/lbry'

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
      const { storeTrack, storePlaylist } = this.props
      // Latest content
      fetchNewClaims({ limit: 10, page: 0 }).then(res => {
        const latestUris = res.map(claimData => `${claimData.name}#${claimData.claim_id}`)
        // Update state: Done!
        this.setState(prevState => ({ latest: [...prevState.latest, ...latestUris] }))

        // Store latest playlist
        storePlaylist('latest', { name: 'Latest', list: latestUris })

        // Store latest playlist
        storePlaylist('featured', { name: 'Featured', list })

        // Featured content
        Lbry.resolve({ uris: [...list, ...latestUris] })
          .then(res => {
            Object.entries(res).map(([uri, value], index) => {
              const { claim: claimData, certificate: channelData, error } = value

              // Filter errors
              if (error || !channelData) return

              // Extract channel data
              channelData && this.getChannelData(channelData)

              // Cache track data
              storeTrack(uri, { channelData, claimData })
              return uri
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
                {list.map((uri, index) => (
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
