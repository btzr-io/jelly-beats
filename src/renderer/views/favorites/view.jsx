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
      favorites: [],
    }
  }

  componentDidMount() {
    const { cache, favorites } = this.props
    // List is empty
    if (favorites.length === 0) {
      // Stop loading data
      this.setState({ fetchingData: false })
    } else {
      // Resolve uris
      Lbry.resolve({ uris: favorites })
        .then(res => {
          const list = Object.entries(res).filter(([key, value]) => !value.error)
          this.setState({
            favorites: list,
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
    const { fetchingData, favorites } = this.state

    const content =
      favorites.length > 0 ? (
        // Render list
        <TrackList list={favorites} />
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
