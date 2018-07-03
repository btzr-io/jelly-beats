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

  //<Link href="/about">Link to next page</Link>

  render() {
    return (
      <div className={css.view}>
        <h1>Jelly-beats</h1>
        <div className={'label'}>Prototype / v-0.0.0</div>
        <h3>Example application usign electron, react and redux + lbry!</h3>
        <div>{list.map(uri => <Card uri={uri} key={uri} />)}</div>
      </div>
    )
  }
}

export default View
