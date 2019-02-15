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

    fetchChannel(claim, channel => {
      storeChannel(channel)
    })
  }

  componentDidMount() {
    const { cache, tracks, setPlaylist } = this.props
    // List is empty
    if (tracks.length === 0) {
      // Stop loading data
      this.setState({ fetchingData: false })
    } else {
      const { storeTrack } = this.props
      // Resolve uris
      Lbry.resolve({ uris: tracks })
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
          title="No downloads"
          message={
            <p>
              <span>{'Press'}</span>
              <span>
                <Icon className="icon icon--small-x" path={icons.PLAY} />
              </span>
              <span>{'to download a track'}</span>
            </p>
          }
        />
      )

    return (
      <div className="page">
        {!fetchingData ? content : <Loader icon={icons.DOWNLOAD} animation="pulse" />}
      </div>
    )
  }
}

export default View
