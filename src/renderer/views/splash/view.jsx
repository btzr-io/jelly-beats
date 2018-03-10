import { h, Component } from 'preact'
import UniversalRouter from 'universal-router'
import history from '@root/history'
import Loader from '@root/components/loader'
import style from './style.module.css'

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
    for (let i = 0; i <= 20; i++) {
      let progress = i * 5
      setTimeout(() => {
        let message = `Progress ${progress}/100`
        this.setState({ progress, message })
        console.info('progress', progress)

        if (progress === 100) {
          this.onProgressDone()
        }
      }, progress * 20)
    }
  }

  render() {
    return (
      <div className={style.view}>
        <h1>Loadign</h1>

        <Loader progress={this.state.progress} />
        <h3>{this.state.message}</h3>
      </div>
    )
  }
}

export default View
