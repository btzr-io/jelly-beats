import React from 'react'
import routes from '@/routes'
import Router from '@/components/router'
import Header from '@/components/header'
import SideBar from '@/components/sidebar'
import navigate from '@/utils/navigate'

class App extends React.PureComponent {
  constructor() {
    super()
  }

  componentDidUpdate(prevProps) {
    // Get current page
    const { currentPage, currentQuery } = this.props.navigation

    // Get previous navigation
    const prevNavigation = prevProps.navigation || {}

    // Get query
    const query = currentQuery !== prevNavigation.currentQuery ? currentQuery : {}

    // Handle navigation
    if (currentPage !== prevNavigation.currentPage) {
      navigate(currentPage, query)
    }
  }

  render() {
    const { children } = this.props
    return (
      <React.Fragment>
        <Header />
        <div id="window">
          <SideBar />
          <Router routes={routes} defaultRoute={'/'} />
        </div>
      </React.Fragment>
    )
  }
}

export default App
