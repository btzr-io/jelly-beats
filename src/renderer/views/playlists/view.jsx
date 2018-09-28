import React from 'react'
import * as icons from '@/constants/icons'
import EmptyState from '@/components/common/emptyState'

class View extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="page">
        <EmptyState
          icon={icons.PLAYLIST_PLUS}
          title="Playlists empty"
          message="( Add message... )"
        />
      </div>
    )
  }
}

export default View
