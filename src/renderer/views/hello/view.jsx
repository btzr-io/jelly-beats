import { h, Component } from 'preact'
import UniversalRouter from 'universal-router'
import Link from '@root/components/link'
import styles from './styles.css'

class View extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.layout}>
        <h1>Hello, world!</h1>
        <h3>Example application usign electron, preact and redux!</h3>
        <Link href="/page-02">Link to page #2</Link>
      </div>
    )
  }
}

export default View
