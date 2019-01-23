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
    const { cache, options, storeTrack, storePlaylist } = this.props

    if (options) {
      const { uri } = options
      const channel = uri ? cache[uri] : null
      if (channel) {
        fetchClaimsByChannel(channel.id, { limit: 20, page: 0 }).then(claims => {
          const channelTracks = claims.map(
            claimData => `${claimData.name}#${claimData.claim_id}`
          )
          // Featured content
          Lbry.resolve({ uris: channelTracks })
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
              storePlaylist(channel.uri, { name: channel.nickname, list: tracks })
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

        this.setState({
          fetchingChannelData: !channel,
          success: true,
          channelData: channel,
        })
      }
    }
  }

  render() {
    const { fetchingData, success, channelData } = this.state

    const avatarImage = {
      backgroundImage: `url(${channelData && channelData.thumbnail})`,
    }

    const content = success ? (
      <div>
        <div className={'profile-box'}>
          <div className={'avatar'} style={avatarImage} />
          <div className="profile-data">
            <div className={'nickname'}>{channelData.nickname}</div>
            <div className={'name'}>{channelData.name}</div>
            <div>
              {channelData.tags.map((tag, key) => (
                <div className={'tag'} key={key}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-bar">
          <div className="tabs">
            <div className="tab active">Tracks</div>
          </div>
          {/* Button label="SUBSCRIBE" /> */}
        </div>
        <div className="tabs-panel">
          <TrackList
            list={this.state.uris}
            name={channelData.nickname}
            showIndex={false}
            showHeader={false}
          />
        </div>
      </div>
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
