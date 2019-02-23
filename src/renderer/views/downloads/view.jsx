import React from 'react'
import Icon from '@mdi/react'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import TrackList from '@/components/trackList'
import Lbry from '@/utils/lbry'

import DataTable from '@/components/common/dataTable.jsx'

import Button from '@/components/button'
import Health from '@/components/common/health'
import PriceLabel from '@/components/common/priceLabel'
import {
  CLOCK as iconClock,
  DOWNLOAD as iconDownload,
  HEART as iconHeart,
  HEART_OUTLINE as iconHeartEmpty,
} from '@/constants/icons'

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
    const { cache, tracks, setPlaylist } = this.props
    // List is empty
    if (tracks.length === 0) {
      // Stop loading data
      this.setState({ fetchingData: false })
    } else {
      const { storeTrack } = this.props
      // const uris = tracks.filter(uri => !cache[uri])
      // Resolve uris
      Lbry.resolve({ uris: tracks })
        .then(res => {
          const list = Object.entries(res).filter(([key, value]) => !value.error)

          const { claim: claimData, certificate: channelData, error } = value

          // Filter errors
          if (error || !channelData) return

          // Extract channel data
          this.getChannelData(channelData)

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
    const {
      cache,
      tracks,
      duration,
      playlist,
      downloads,
      favorites,
      toggleFavorite,
    } = this.props
    const { name, uri } = playlist
    /*
    const list = tracks.map(uri=> cache[uri]).filter(item => item && item !== null)

    const columns = [
      {
        label: '#',
        dataKey: 'index',
        className: 'table__row__cell-center',
        width: 25,
        flexGrow: 0,
        flexShrink: 0,
        disableSort: true,
      },
      {
        label: '',
        dataKey: 'favorite',
        className: 'table__row__cell-center',
        width: 50,
        flexGrow: 0,
        flexShrink: 0,
        disableSort: true,
        cellDataGetter: ({dataKey, rowData}) => (rowData && favorites.indexOf(rowData.uri) !== -1),
        cellRenderer: ({ rowData, cellData: isFavorite }) => (
          <Button
            size="large"
            type="table-action"
            iconColor={isFavorite ? 'var(--color-red)' : ''}
            icon={isFavorite ? iconHeart : iconHeartEmpty}
            toggle={isFavorite}
            onClick={() => toggleFavorite(rowData.uri)}
            // disabled={true}
          />
        ),
      },
      { label: 'Track', dataKey: 'title', width: 250, flexGrow: 1 },
      { label: 'Artist', dataKey: 'artist', width: 250,
          cellDataGetter: ({dataKey, rowData}) => {
            return (rowData ? rowData[dataKey].channelName : '?')
          },
      },
      {
        label: 'Price',
        dataKey: 'fee',
        width: 150,
        cellRenderer: ({ cellData }) => (
          <PriceLabel className={'row_label'} fee={cellData} />
        ),
      },
      {
        label: <Icon className="icon link__icon" path={iconClock} />,
        dataKey: 'duration',
        width: 75,
        cellDataGetter: ({dataKey, rowData}) => {
          const { duration } = (rowData && downloads[rowData.uri]) || {}
          return duration || 0
        },
      },
    ]
    */
    const content =
      tracks.length > 0 ? (
        // Render list
        <section className={'page--layout'}>
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
          <div className={'page--content'}>
            <TrackList list={tracks} playlist={{ uri, name }} />
            {/* <DataTable list={list} columns={columns} /> */}
          </div>
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
        {!fetchingData ? content : <Loader icon={iconDownload} animation="pulse" />}
      </div>
    )
  }
}

export default View
