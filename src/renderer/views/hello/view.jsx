import React from 'react'
import UniversalRouter from 'universal-router'
import Link from '@/components/link'
import Card from '@/components/card'
import list from '@/utils/api'
import css from '@/css/modules/view.css.module'

class View extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={css.view}>
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
