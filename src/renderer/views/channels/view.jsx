import React from 'react'
import * as icons from '@/constants/icons'
import Icon from '@mdi/react'
import Lbry from '@/utils/lbry'
import fetchChannel from '@/api/channel'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import ChannelCard from './channelCard'

function getProfileData(res) {
  const { claim } = res
  let data = {}

  if (claim && claim.channel_name && claim.value && claim.value.stream) {
    // Get channelName
    const { metadata } = claim.value.stream
    data.channelName = claim.channel_name

    if (metadata && metadata.description) {
      // Get profile data
      const profileData = JSON.parse(metadata.description)
      data.authorName = profileData.name
      data.thumbnail = profileData.thumbnail
    }
  }
  return data
}

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      success: null,
      fetchingData: true,
    }
  }

  getChannelData(claim) {
    const { storeChannel } = this.props
    storeChannel(claim)
  }

  componentDidMount() {
    // Resolve uris
    Lbry.channel_list()
      .then(claims => {
        const channels = claims.map(claim => {
          this.getChannelData(claim)
          return claim.permanent_url
        })
        // Update state
        this.setState({
          channels,
          success: true,
          fetchingData: false,
        })
      })
      // Handle errors:
      // The profile don't exist or has wrong data.
      .catch(err => {
        this.setState({ fetchingData: false, success: false })
      })
  }

  render() {
    const { cache, doNavigate, setCurrentChannel, currentChannel } = this.props
    const { fetchingData, success, channels } = this.state

    const content =
      success && cache ? (
        // Render profile
        <section>
          <h1>My channels</h1>
          {channels.map(uri => {
            const channel = cache[uri]
            const active = currentChannel.uri === uri
            return (
              <ChannelCard
                action={() => {
                  setCurrentChannel(uri)
                }}
                isActive={active}
                channelData={channel}
                doNavigate={doNavigate}
                uri={uri}
                key={uri}
              />
            )
          })}
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
