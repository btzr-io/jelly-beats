import { h, Component } from 'preact'
import UniversalRouter from 'universal-router'
import history from '@root/history'
import Loader from '@root/components/loader'
import styles from './styles.css'

export class View extends Component {
  constructor(props) {
    super(props)

    this.state = {
      progress: 0,
      message: 'Loadign...',
    }
  }

  onProgressDone() {
    console.log('Ready to go!')
    // Init location:
    setTimeout(() => history.push({ hash: '/hello' }), 500)
  }

  componentDidMount() {
    // Test: Remove later!
    const speed = 20
    let progress = 0
    // Fake task
    console.log('Startup task: running..')
    // Fake progress
    for (let i = 0; i <= speed; i++) {
      let progress = i * 5
      setTimeout(() => {
        // Update state
        let message = `Progress ${progress} / 100`
        this.setState({ progress, message })
        // Log progress
        console.log('Progress:', progress)
        // Done!
        progress === 100 && this.onProgressDone()
      }, progress * speed)
    }
  }

  render() {
    return (
      <div className={styles.layout}>
        <h1>Loadign</h1>

        <Loader progress={this.state.progress} />
        <h3>{this.state.message}</h3>
      </div>
    )
  }
}

export default View
