import React from 'react'
import * as icons from '@/constants/icons'
import Icon from '@mdi/react'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import Button from '@/components/button'
import TimeLine from '@/components/timeLine'
import { Lbry } from 'lbry-redux'

function getMultipleValues(str) {
  str = str.replace(/\s+/g, '')
  return str.split(',')
}

function getProfileData(res) {
  const { claim } = res
  if (claim && claim.channel_name && claim.value && claim.value.stream) {
    // Get channelName
    const { metadata } = claim.value.stream

    if (metadata && metadata.description) {
      // Get profile data
      const profileData = JSON.parse(metadata.description)
      data.authorName = profileData.name
      data.thumbnail = profileData.thumbnail
      data.location = profileData.location
      data.type = getMultipleValues(profileData.type)
    }
  }
  console.info(data)
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

  fetchChannel() {}

  fetchProfile() {
    const channel_Id = ''
    const channelName = '@Btzr'
    // Default data
    let data = {
      type: [],
      thumbnail: '',
      authorName: channelName.substring(1),
    }
    // Resolve uris
    Lbry.resolve({ uri: channelName + '/profile' })
      .then(res => {
        console.info(res)
        data = getProfileData(res)
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
        console.log(data)
        if (data) {
          this.setState({ data, fetchingData: false, success: true })
        } else {
          this.setState({ fetchingData: false, success: false })
        }
      })
  }

  componentDidMount() {
    this.fetchProfile()
  }

  render() {
    const { fetchingData, success, data } = this.state

    const avatarImage = {
      backgroundImage: `url(${data && data.thumbnail})`,
    }

    const channelEvents = success
      ? [
          {
            author: data.channelName,
            action: 'published',
            date: 'jun 12',
            content: '@Beethoven/moonlight',
          },
          { author: data.channelName, action: 'joined', date: 'jun 12' },
        ]
      : []

    const content = success ? (
      // Render profile
      <div>
        <div className={'profile-box'}>
          <div className={'avatar'} style={avatarImage} />
          <div className="profile-data">
            <div className={'nickname'}>{data.channelName}</div>
            <div className={'name'}>{data.authorName}</div>
            <div>
              {data.type.map((tag, key) => (
                <div className={'tag'} key={key}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-bar">
          <div className="tabs">
            <div className="tab active">Activity</div>
            <div className="tab">Tracks</div>
          </div>
          <Button label="SUBSCRIBE" />
        </div>
        <TimeLine events={channelEvents} />
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
