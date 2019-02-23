import React from 'react'
import Icon from '@mdi/react'

// Utils
import Lbry from '@/utils/lbry'

// Components
import Loader from '@/components/common/loader'
import TrackList from '@/components/trackList'
import EmptyState from '@/components/common/emptyState'

import fetchChannel from '@/api/channel'

// Constants
import * as icons from '@/constants/icons'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      fetchingData: true,
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

  componentDidMount() {
    const { cache, tracks, storeTrack, setPlaylist } = this.props
    // List is empty
    if (tracks.length === 0) {
      // Stop loading data
      this.setState({ fetchingData: false })
    } else {
      // Resolve uris
      Lbry.resolve({ urls: tracks })
        .then(res => {
          const list = Object.entries(res)
            .filter(([uri, value]) => !value.error && value.certificate)
            .map(([uri, value], index) => {
              const { claim: claimData, certificate: channelData } = value
              // Extract channel data
              this.getChannelData(channelData)
              // Cache track data
              storeTrack(uri, { channelData, claimData })
              return uri
            })
          this.setState({ fetchingData: false })
        })
        // Handle errors
        .catch(err => {
          this.setState({ fetchingData: false })
        })
    }
  }

  render() {
    const { fetchingData } = this.state
    const { tracks, duration, playlist } = this.props
    const { name, uri } = playlist

    const content =
      tracks.length > 0 ? (
        // Render list
        <section>
          <header>
            <h1>{name}</h1>
            <div className={'stats'}>
              <span className={'label label-outline'}>AUTO-GENERATED</span>
              <span>•</span>
              <span>{`${tracks.length} tracks`}</span>
              <span>•</span>
              <span>{duration}</span>
            </div>
          </header>
          <TrackList list={tracks} playlist={{ uri, name }} />
        </section>
      ) : (
        // List is empty
        <EmptyState
          title="No favorites?"
          message={
            <p>
              <span>{'Press'}</span>
              <span>
                <Icon className="icon icon--small-x" path={icons.HEART} />
              </span>
              <span>{'to add something you like'}</span>
            </p>
          }
        />
      )

    return (
      <div className="page">
        {!fetchingData ? content : <Loader icon={icons.HEART} animation="pulse" />}
      </div>
    )
  }
}

export default View
