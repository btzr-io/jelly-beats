import React from 'react'
import * as icons from '@/constants/icons'
import Icon from '@mdi/react'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import TrackList from '@/components/trackList'
import Lbry from '@/utils/lbry'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      fetchingData: true,
    }
  }

  getChannelData(claim) {
    const { storeChannel } = this.props
    storeChannel(claim)
  }

  componentDidMount() {
    const { cache, tracks, setPlaylist } = this.props
    // List is empty
    if (!tracks || tracks.length === 0) {
      // Stop loading data
      this.setState({ fetchingData: false })
    } else {
      const { storeTrack } = this.props
      // Resolve uris
      Lbry.resolve({ urls: tracks })
        .then(res => {
          const list = Object.entries(res).filter(([key, value]) => !value.error)

          const { claim: claimData, certificate: channelData, error } = value

          // Filter errors
          if (error || !channelData) return

          // Extract channel data
          channelData && this.getChannelData(channelData)

          // Cache track data
          storeTrack(uri, { channelData, claimData })

          this.setState({
            fetchingData: false,
          })
        })
        // Handle errors
        .catch(err => {
          this.setState({ fetchingData: false })
        })
    }
  }

  render() {
    const { tracks, duration, playlist } = this.props
    const { fetchingData } = this.state

    const content =
      tracks && tracks.length > 0 ? (
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
        <EmptyState title="Playlist empty!" message="" />
      )

    return (
      <div className="page">
        {!fetchingData ? content : <Loader icon={icons.PLAYLIST} animation="pulse" />}
      </div>
    )
  }
}

export default View
