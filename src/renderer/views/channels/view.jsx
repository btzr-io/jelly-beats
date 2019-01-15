import React from 'react'
import * as icons from '@/constants/icons'
import Icon from '@mdi/react'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import Lbry from '@/utils/lbry'

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

  componentDidMount() {
    const channelName = '@btzr'
    // Resolve uris
    Lbry.resolve({ uri: channelName + '/profile' })
      .then(res => {
        const data = getProfileData(res)
        console.info(res)
        // Update state
        this.setState({
          data,
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
    const { fetchingData, success, data } = this.state

    const content = success ? (
      // Render profile
      <div>
        <img src={data.thumbnail} />
        <div>{data.authorName}</div>
        <div>{data.channelName}</div>
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
