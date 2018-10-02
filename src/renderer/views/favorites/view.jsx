import React from 'react'
import * as icons from '@/constants/icons'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import TrackList from '@/components/trackList'
import list from '@/utils/api'
import { Lbry } from 'lbry-redux'

class View extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fetchingData: true,
      favorites: [],
    }
  }

  componentDidMount() {
    Lbry.resolve({ uris: list })
      .then(res => {
        this.setState({
          favorites: Object.entries(res),
          fetchingData: false,
        })
      })
      .catch(err => {
        this.setState({ fetchingData: false })
      })
  }

  render() {
    const { fetchingData, favorites } = this.state

    const content =
      favorites.length > 0 ? (
        // Render list
        <TrackList list={favorites} />
      ) : (
        // List is empty
        <EmptyState
          icon={icons.HEART_BROKEN}
          title="Favorites empty"
          message="( Add message... )"
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
