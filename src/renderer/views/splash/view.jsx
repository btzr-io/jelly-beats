import { h, Component } from 'preact'
import UniversalRouter from 'universal-router'
import history from '@root/history'
import Loader from '@root/components/loader'
import styles from './style.module.css'

export class SplashScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      progress: 0,
      message: 'Loadign...',
    }
  }

  onProgressDone() {
    console.log('Ready to go!')
  }

  componentDidMount() {
    // Test: Remove later!
    for (let i = 0; i <= 100; i++) {
      setTimeout(() => {
        let progress = i
        let message = `Progress ${i}/100`
        this.setState({ progress, message })
        console.info('progress', progress)

        if (progress === 100) {
          this.onProgressDone()
        }
      }, i * 75)
    }
  }

  render() {
    return (
      <div className={styles.view}>
        <br />
        <h2>{this.state.message}</h2>
        <br />
        <Loader progress={this.state.progress} />
      </div>
    )
  }
}

export default SplashScreen
