import React from 'react'
import * as icons from '@/constants/icons'
import EmptyState from '@/components/common/emptyState'
import TrackList from '@/components/trackList'
import list from '@/utils/api'

class View extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="page">
        {list && list.length === 0 ? (
          <EmptyState
            icon={icons.HEART_BROKEN}
            title="Favorites empty"
            message="( Add message... )"
          />
        ) : (
          <TrackList list={list} />
        )}
      </div>
    )
  }
}

export default View
