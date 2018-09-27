import React from 'react'
import routes from '@/routes'
import Router from '@/components/router'
import Header from '@/components/header'
import SideBar from '@/components/sidebar'
import navigate from '@/utils/navigate'

class App extends React.Component {
  constructor() {
    super()
  }

  componentDidUpdate(prevProps) {
    // Get current page
    const { currentPage, currentQuery } = this.props
    const query = currentQuery !== prevProps.query ? currentQuery : {}
    // Handle navigation

    if (currentPage !== prevProps.currentPage) {
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
