import { h, Component } from 'preact'
import UniversalRouter from 'universal-router'
import history from '../history'

class Router extends Component {
  constructor(props) {
    super(props)
    const { routes } = this.props

    const options = {
      baseName: '/',
      resolveRoute(context, params) {
        // Trigger route action
        return typeof context.route.action === 'function'
          ? context.route.action(context, params)
          : undefined
      },
      errorHandler(error) {
        // Trow error
        console.error(error)
        // Render error page
        //console.log('Error:', error.code)
      },
    }

    this.router = new UniversalRouter(routes, options)
    this.state = {
      page: null,
    }
  }

  resolve(route) {
    // Update...
    const page = this.router.resolve(route).then(page => {
      page && this.setState({ page })
    })
  }

  componentDidMount() {
    // Listen for changes to the current location.
    const unlisten = history.listen((location, action) => {
      // Get route location
      const route = location.hash.replace('#/', '/')
      // Resolve router
      this.resolve(route)
    })
  }

  render() {
    return <div className="view">{this.state.page}</div>
  }
}

export default Router
