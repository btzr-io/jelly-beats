import { h, Component } from 'preact'
import UniversalRouter from 'universal-router'
import Link from '@root/components/link'
import style from './style.module.css'

class View extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={style.view}>
        <h1>Hello, world!</h1>
        <h3>Example application usign electron, preact and redux!</h3>
        <Link href="/page-02"> Click bait!</Link>
      </div>
    )
  }
}

export default View
