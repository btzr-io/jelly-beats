import React from 'react'
import * as icons from '@/constants/icons'
import EmptyState from '@/components/common/emptyState'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="page">
        <EmptyState title="No podcasts yet?" message="( Coming soon )" />
      </div>
    )
  }
}

export default View
