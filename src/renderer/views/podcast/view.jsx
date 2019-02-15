import React from 'react'
import moment from 'moment'
import * as icons from '@/constants/icons'
import { fetchClaimsByChannel } from '@/utils/chainquery'
import fetchChannel from '@/api/channel'
import Icon from '@mdi/react'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import Button from '@/components/button'
import TimeLine from '@/components/timeLine'
import Lbry from '@/utils/lbry'
import TrackList from '@/components/trackList'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      uris: [],
      success: null,
      channelData: null,
      fetchingData: true,
      fetchChannelData: true,
    }
  }

  getChannelData(claim) {
    const { storeChannel } = this.props

    fetchChannel(claim, channel => {
      storeChannel(channel)
    })
  }

  componentDidMount() {
    const { podcasts, options, storeTrack, storePlaylist } = this.props

    if (options) {
      const { uri } = options
      const podcast = uri ? podcasts[uri] : null
      if (podcast) {
        fetchClaimsByChannel(podcast.id, { limit: 25, page: 0 }).then(claims => {
          const episodes = claims.map(
            claimData => `${claimData.name}#${claimData.claim_id}`
          )
          // Featured content
          Lbry.resolve({ uris: episodes })
            .then(res => {
              const tracks = Object.entries(res)
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
                .filter(uri => uri && uri != null)

              // Update state: Done!
              this.setState({
                uris: tracks,
                error: false,
                fetchingData: false,
              })

              // store playlist from channel
              storePlaylist(podcast.uri, { name: podcast.title, list: tracks })
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

        this.setState({ success: true, podcastData: podcast })
      }
    }
  }

  render() {
    const { fetchingData, success, podcastData } = this.state

    const avatarImage = {
      backgroundImage: `url(${podcastData && podcastData.thumbnail})`,
    }

    const content = success ? (
      <section>
        <header>
          <div className={'profile-box'}>
            <div className={'avatar'} style={avatarImage} />
            <div className="profile-data">
              <h1 className={'name'}>{podcastData.title}</h1>
              <div className={'stats'}>
                <span className={'label label-outline'}>Podcast</span>
                <span>•</span>
                <span>{podcastData.host}</span>
                <span>•</span>
                <span>{`${this.state.uris.length} episodes`}</span>
              </div>
            </div>
          </div>
        </header>
        <TrackList
          type={'podcast'}
          list={this.state.uris}
          playlist={{
            uri: podcastData.uri,
            name: podcastData.title,
          }}
        />
      </section>
    ) : (
      // List is empty
      <EmptyState
        title="No Channels yet?"
        message={
          <p>
            <span>{'Create a new channel or switch to one.'}</span>
          </p>
        }
      />
    )

    return (
      <div className="page">
        {!fetchingData ? content : <Loader icon={icons.SPINNER} animation="spin" />}
      </div>
    )
  }
}

export default View
