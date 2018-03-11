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
        <h1>About</h1>
        <h3>Use yarn to install all dependencies, to build the app use yarn dev.</h3>
        <Link href="/hello">Go back!</Link>
      </div>
    )
  }
}

export default View
