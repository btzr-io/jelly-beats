import React from 'react'
import moment from 'moment'
import { connect } from 'unistore/react'

import Lbry from '@/utils/lbry'
import fetchChannel from '@/api/channel'
import classnames from 'classnames'
import Button from '@/components/button'
import Health from '@/components/common/health'
import PriceLabel from '@/components/common/priceLabel'
import * as icons from '@/constants/icons'

// import worker bundle
import Vibrant from 'node-vibrant/lib/bundle-worker'

class TrackListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fetchingData: true,
    }
  }

  handleFetchError = error => {
    console.error(error)
    // Deamon has stop running
    this.setState({ error: true, fetchingData: false })
  }

  getPalette(src) {
    // Adaptive UI
    const { storePalette, uri } = this.props
    Vibrant.from(src)
      .quality(10)
      .maxColorCount(32)
      .getPalette()
      .then(palette => {
        const rgb = palette.DarkMuted.getRgb()
        const dark = `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 0.4)`
        const vibrant = palette.Vibrant.getHex()

        storePalette(uri, { dark, vibrant })
      })
  }

  getChannelData(claim) {
    const { storeChannel } = this.props

    fetchChannel(claim, channel => {
      storeChannel(channel)
    })
  }

  componentDidMount() {
    const { uri, claim, storeTrack } = this.props
    if (claim) {
      this.setState({ fetchingData: false })
      const { thumbnail } = claim
      thumbnail && thumbnail.length > 0 && this.getPalette(thumbnail)
    } else {
      Lbry.resolve({ uri })
        .then(res => {
          console.info(res)
          const { claim: claimData, certificate: channelData, error } = res

          // Filter errors
          if (error || !channelData) return

          // Extract channel data
          channelData && this.getChannelData(channelData)

          // Cache track data
          storeTrack(uri, { channelData, claimData })

          // Update state: Done!
          this.setState({
            error: false,
            fetchingData: false,
          })
        })
        // Handle errors
        .catch(this.handleFetchError)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { fetchingData } = this.state
    const { claim } = this.props
    if (claim) {
      const { uri } = claim
      const prevUri = prevProps.claim && prevProps.claim.uri
      if (uri !== prevUri) {
        this.setState({ fetchingData: false })
      }
    }
  }

  render() {
    const {
      uri,
      index,
      claim,
      duration,
      isActive,
      completed,
      isPlaying,
      isFavorite,
      isAvailable,
      doNavigate,
      attempPlay,
      togglePlay,
      isDownloading,
      toggleFavorite,
    } = this.props

    const { fetchingData } = this.state

    if (fetchingData || !claim) {
      return (
        <tr className={'row--placeholder animated--fade-in'}>
          <td>
            <div className="row_item">
              <span className="row_label">{index}</span>
            </div>
          </td>

          <td>
            <Button
              size="large"
              type="table-action"
              icon={icons.HEART_OUTLINE}
              disabled={true}
            />
          </td>
          <td>
            <span className="row_label row_label--temp large" />
          </td>
          <td>
            <span className="row_label row_label--temp medium" />
          </td>
          <td>
            <span className="row_label row_label--temp small" />
          </td>
          <td>
            <span className="row_label row_label--temp small" />
          </td>
        </tr>
      )
    }

    const { artist, title, fee } = claim

    const disabled = isAvailable === false

    const shouldPurchase = !isDownloading && !completed

    let buttonIcon = isDownloading ? icons.SPINNER : !isPlaying ? icons.PLAY : icons.PAUSE

    if (shouldPurchase) {
      buttonIcon = icons.DOWNLOAD
    }

    if (isPlaying) {
      const { uri, name, setPlaylist } = this.props
      setPlaylist({ uri, name, index })
    }

    return (
      <tr
        className={classnames('row', 'animated--fade-in', {
          'row--active': isActive,
          'row--busy': isDownloading,
          'row--disabled': disabled,
        })}
      >
        <td>
          <div className="row_item">
            <Button
              icon={buttonIcon}
              type="table-action--overlay"
              size="large"
              toggle={isPlaying && !isDownloading}
              animation={isDownloading && 'spin'}
              onClick={() => {
                !isPlaying && !isDownloading ? attempPlay(uri, { index }) : togglePlay()
              }}
            />
            <span className="row_label">{index}</span>
          </div>
        </td>

        <td>
          <Button
            iconColor={isFavorite ? 'var(--color-red)' : ''}
            icon={isFavorite ? icons.HEART : icons.HEART_OUTLINE}
            type="table-action"
            size="large"
            toggle={isFavorite}
            // TODO: FIX IT!
            // tooltip={{ text: `${isFavorite ? 'Remove from' : 'Add to'} favorites` }}
            onClick={() => toggleFavorite(uri)}
          />
        </td>

        <td>
          <span
            className="row_label row_label--link trunk-label"
            onClick={() => !shouldPurchase && triggerPlay()}
          >
            <Health status={{ completed, isAvailable, isDownloading }} />
            {title}
          </span>
        </td>

        <td>
          {artist && (
            <span
              className="row_label row_label--link"
              onClick={() => doNavigate('/profile', { uri: artist.channelUri })}
            >
              {artist.channelName}
            </span>
          )}
        </td>

        <td>
          <span className="row_label">
            {duration ? moment.utc(duration * 1000).format('mm:ss') : '?'}
          </span>
        </td>

        <td>
          <PriceLabel className={'row_label'} fee={fee} />
        </td>
      </tr>
    )
  }
}

export default connect(
  (state, props) => {
    const { uri } = props
    const { cache, player, collections } = state
    const { favorites, downloads } = collections || {}
    const isFavorite = favorites.indexOf(uri) > -1

    //Get stream status
    const { duration, completed, isAvailable, isDownloading } = downloads[uri] || {}

    //Get player status
    const { paused, isLoading, currentTrack } = player || {}
    const isActive = completed && (currentTrack ? currentTrack.uri === uri : false)
    const isPlaying = !paused && isActive
    const claim = cache[uri]

    return {
      claim,
      completed,
      duration,
      isActive,
      isFavorite,
      isAvailable,
      isPlaying,
      isDownloading,
    }
  },
  {
    storeTrack: 'storeTrack',
    storeChannel: 'storeChannel',
    storePalette: 'storePalette',
    setPlaylist: 'setPlaylist',
    doNavigate: 'doNavigate',
    attempPlay: 'triggerAttempPlay',
    togglePlay: 'triggerTogglePlay',
    toggleFavorite: 'toggleFavorite',
  }
)(TrackListItem)
