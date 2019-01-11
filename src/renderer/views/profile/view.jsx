import React from 'react'
import moment from 'moment'
import * as icons from '@/constants/icons'
import { fetchClaimsByChannel } from '@/utils/chainquery'
import Icon from '@mdi/react'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import Button from '@/components/button'
import TimeLine from '@/components/timeLine'
import { Lbry } from 'lbry-redux'
import TrackList from '@/components/trackList-test'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      success: null,
      channelData: null,
      fetchingData: true,
      uris: [],
    }
  }

  parseMetadata(channelData, claimData) {
    const { favorites, storeTrack } = this.props

    const { name, claim_id } = claimData

    const uri = name + '#' + claim_id

    const isFavorite = favorites.indexOf(uri) > -1

    const {
      thumbnail,
      author,
      title,
      description,
      fee,
      vout,
      transaction_hash_id: txid,
      vout: nout,
    } = claimData

    // Generate claim outpoint
    const outpoint = `${txid}:${nout}`

    // Get creator
    const artist = {
      channelUri: channelData ? channelData.uri : null,
      channelName: channelData ? channelData.nickname : author,
    }

    // Cache data
    storeTrack(uri, {
      fee,
      title,
      artist,
      outpoint,
      thumbnail,
      isFavorite,
      description,
    })

    this.setState(prevState => ({
      uris: [...prevState.uris, uri],
    }))
  }

  componentDidMount() {
    const { cache, options } = this.props

    if (options) {
      const { uri } = options
      const channel = uri ? cache[uri] : null
      if (channel) {
        fetchClaimsByChannel(channel.id).then(claims => {
          claims.map(claim => {
            this.parseMetadata(channel, claim)
          })
        })

        this.setState({ fetchingData: false, success: true, channelData: channel })
      }
    }
  }

  render() {
    const { fetchingData, success, channelData } = this.state

    const avatarImage = {
      backgroundImage: `url(${channelData && channelData.thumbnail})`,
    }

    const content = success ? (
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
            <div className="tab active">Tracks</div>
          </div>
          {/* Button label="SUBSCRIBE" /> */}
        </div>
        <div className="tabs-panel">
          <TrackList list={this.state.uris} showIndex={false} showHeader={false} />
        </div>
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
