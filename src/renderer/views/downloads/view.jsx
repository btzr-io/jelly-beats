import React from 'react'
import Icon from '@mdi/react'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import TrackList from '@/components/trackList'
import Lbry from '@/utils/lbry'

import { PLAY as iconPlay, DOWNLOAD as iconDownload } from '@/constants/icons'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    const { loadingTracks } = props

    this.state = {
      fetchingData: loadingTracks.length > 0,
    }
  }

  getChannelData(claim) {
    const { storeChannel } = this.props
    storeChannel(claim)
  }

  componentDidMount() {
    const { fetchingData } = this.state
    const { tracks, loadingTracks, storeTrack } = this.props
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
        fetchingData ? (
          <Loader icon={iconDownload} animation="pulse" />
        ) : (
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
        )
      ) : (
        // List is empty
        <EmptyState
          title="No downloads"
          message={
            <p>
              <span>{'Press'}</span>
              <span>
                <Icon className="icon icon--small-x" path={iconPlay} />
              </span>
              <span>{'to download a track'}</span>
            </p>
          }
        />
      )

    return <div className="page">{content}</div>
  }
}

export default View
