import React from 'react'
import UniversalRouter from 'universal-router'
import Link from '@/components/link'
import Card from '@/components/card'
import TrackList from '@/components/trackList'
import list from '@/utils/api'

class View extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="page">
        <div>
          {list.map(uri => (
            <Card uri={uri} key={uri} />
          ))}
        </div>
      </div>
    )
  }
}

export default View
