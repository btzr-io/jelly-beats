import React from 'react'
import UniversalRouter from 'universal-router'
import Link from '@root/components/link'
import Card from '@root/components/card'
import css from '@root/css/modules/view.css.module'
import list from '@root/utils/api'

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
