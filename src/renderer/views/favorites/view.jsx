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
          icon={icons.HEART_BROKEN}
          title="Favorites empty"
          message="( Add message... )"
        />
      </div>
    )
  }
}

export default View
