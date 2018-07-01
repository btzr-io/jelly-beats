import React from 'react'
import UniversalRouter from 'universal-router'
import history from '@root/history'
import Header from '@/components/header'

class Router extends React.Component {
  constructor(props) {
    super(props)
    const { routes, defaultRoute, errorRouter } = this.props

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
        errorRouter && history.push({ hash: errorRouter })
      },
    }

    this.router = new UniversalRouter(routes, options)
    this.state = {
      page: null,
    }
  }

  resolve(route, context) {
    // Update...
    this.router.resolve({ pathname: route, ...context }).then(page => {
      page && this.setState({ page })
    })
  }

  componentDidMount() {
    const { defaultRoute } = this.props
    // Listen for changes to the current location.
    const unlisten = history.listen((location, action) => {
      // Get route location
      const route = location.hash.replace('#/', '/')
      // Get route params
      const params = location.state

      // Resolve router
      this.resolve(route, params)
    })
    // if defaultRoute
    defaultRoute && history.push({ hash: defaultRoute })
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="view">{this.state.page}</div>
      </React.Fragment>
    )
  }
}

export default Router
