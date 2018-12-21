import React from 'react'
import * as icons from '@/constants/icons'
import Icon from '@mdi/react'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import Button from '@/components/button'
import TimeLine from '@/components/timeLine'
import { Lbry } from 'lbry-redux'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      success: null,
      channelData: null,
      fetchingData: true,
    }
  }

  componentDidMount() {
    const { cache, options } = this.props

    if (options) {
      const { uri } = options
      const channelData = uri ? cache[uri] : null
      channelData && this.setState({ fetchingData: false, success: true, channelData })
    }
  }

  render() {
    const { fetchingData, success, channelData } = this.state

    const avatarImage = {
      backgroundImage: `url(${channelData && channelData.thumbnail})`,
    }

    const channelEvents = success
      ? [
          {
            author: null,
            action: 'published',
            date: 'jun 12',
            content: '@Beethoven/moonlight',
          },
        ]
      : []

    const content = success ? (
      // Render profile
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
