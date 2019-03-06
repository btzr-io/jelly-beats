import React from 'react'
import Icon from '@mdi/react'
import moment from 'moment'

// Constants
import * as icons from '@/constants/icons'

// Utils
import Lbry from '@/utils/lbry'
import { fetchClaimsByChannel } from '@/utils/chainquery'
import fetchChannel from '@/api/channel'

// Components
import Button from '@/components/button'
import TrackList from '@/components/trackList'
import Loader from '@/components/common/loader'
import Thumbnail from '@/components/common/thumbnail'
import EmptyState from '@/components/common/emptyState'

// import TimeLine from '@/components/timeLine'

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

  handleFetchError(err) {
    console.error(err)
    this.setState({
      error: true,
      fetchingData: false,
    })
  }

  handleFetchCompleted(playlist, list) {
    const { storePlaylist } = this.props
    // Update state: Done!
    this.setState({
      uris: list,
      error: false,
      fetchingData: false,
    })
    // store playlist from channel
    storePlaylist(playlist.uri, { list, name: playlist.title })
  }

  getChannelData(claim) {
    const { storeChannel } = this.props
    storeChannel(claim)
  }

  componentDidMount() {
    const { cache, podcasts, options, storeTrack, storePlaylist } = this.props
    if (options) {
      const { uri } = options
      const podcast = uri ? podcasts[uri] : null
      if (podcast) {
        fetchClaimsByChannel(podcast.id, { limit: 25, page: 0 }).then(claims => {
          const cachedUris = []
          const urls = claims
            .map(claimData => {
              const {
                name,
                vout: nout,
                claim_id: id,
                transaction_hash_id: txid,
              } = claimData
              // Generate claim uri
              const uri = `${name}#${id}`
              // Generate claim outpoint
              const outpoint = `${txid}:${nout}`
              // Filter cached content
              const prevOutpoint = cache[uri] && cache[uri].outpoint
              // Save to resolve list
              if (prevOutpoint !== outpoint) {
                return uri
              }
              // Save to cached list
              cachedUris[cachedUris.length] = uri
              return null
            })
            .filter(uri => uri && uri !== null)

          if (urls.length > 0) {
            // Featured content
            Lbry.resolve({ urls })
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
                  .filter(uri => uri && uri !== null)

                const list = [...cachedUris, ...tracks]
                this.handleFetchCompleted(podcast, list)
              })
              // Handle errors
              .catch(this.handleFetchError)
          } else {
            this.handleFetchCompleted(podcast, cachedUris)
          }
        })

        this.setState({ success: true, podcastData: podcast })
      }
    }
  }

  render() {
    const { fetchingData, success, podcastData } = this.state

    const content = success ? (
      <section className={'page--layout'}>
        <div className={'profile-box'}>
          <Thumbnail className={'profile-avatar'} src={podcastData.thumbnail} />
          <div className="profile-data">
            <h1 className={'name'}>{podcastData.title}</h1>
            <div className={'stats'}>
              <span className={'label label-outline'}>Podcast</span>
              <span>•</span>
              <span>{podcastData.host}</span>
              <span>•</span>
              <span>{`${this.state.uris.length} episodes`}</span>
            </div>
          </div>
        </div>
        <div className={'page--content'}>
          <TrackList
            type={'podcast'}
            tracks={this.state.uris}
            playlist={{
              uri: podcastData.uri,
              name: podcastData.title,
            }}
          />
        </div>
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
