import { h, Component } from 'preact'
import UniversalRouter from 'universal-router'
import history from '../history'

class Router extends Component {
  constructor(props) {
    super(props)

    this.state = {
      page: null,
    }
  }

  componentDidMount() {}

  render() {
    return (
      <div className="view">
        <h1>Loadign...</h1>
      </div>
    )
  }
}

export default Router
