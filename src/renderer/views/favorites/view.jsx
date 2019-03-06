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
    const { loadingTracks } = this.props
    this.state = {
      fetchingData: loadingTracks.length > 0,
    }
  }

  getChannelData(claim) {
    const { storeChannel } = this.props
    storeChannel(claim)
  }

  componentDidMount() {
    const { tracks, loadingTracks, storeTrack, setPlaylist } = this.props
    // List is empty
    if (tracks.length === 0 || loadingTracks.length === 0) {
      // Stop loading data
      this.setState({ fetchingData: false })
    } else {
      // Resolve uris
      Lbry.resolve({ urls: loadingTracks })
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
    const { tracks, playlist, duration } = this.props
    const content =
      tracks.length > 0 ? (
        // Render list
        <section className={'page--layout'}>
          <header>
            <h1>{playlist.name}</h1>
            <div className={'stats'}>
              <span className={'label label-outline'}>AUTO-GENERATED</span>
              <span>•</span>
              <span>{`${tracks.length} tracks`}</span>
              <span>•</span>
              <span>{duration}</span>
            </div>
          </header>
          <div className={'page--content'}>
            <TrackList tracks={tracks} playlist={playlist} />
          </div>
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
