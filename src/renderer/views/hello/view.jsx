import { h, Component } from 'preact'
import UniversalRouter from 'universal-router'
import style from './style.module.css'

export class View extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={style.view}>
        <h1>Hello, world!</h1>
        <h3>Example application usign electron, preact and redux!</h3>
      </div>
    )
  }
}

export default View
