import { h, Component } from 'preact'
import styles from './styles.css'

class Loader extends Component {
  constructor() {
    super()
  }

  render() {
    const { children } = this.props
    const { progress } = this.props
    const innerStyles = { width: `${progress}%` }
    return (
      <div className={styles.bar}>
        <div className={styles.progress} style={innerStyles} />
      </div>
    )
  }
}

export default Loader
