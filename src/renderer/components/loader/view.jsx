import { h, Component } from 'preact'
import style from './style.module.css'

class Loader extends Component {
  constructor() {
    super()
  }

  render() {
    const { children } = this.props
    const { progress } = this.props
    const innerStyle = { width: `${progress}%` }
    return (
      <div className={style.bar}>
        <div className={style.progress} style={innerStyle} />
      </div>
    )
  }
}

export default Loader
