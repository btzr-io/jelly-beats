import React from 'react'
import routes from '@/routes'
import Router from '@/components/router'
import Header from '@/components/header'
import Player from '@/components/player'
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
    const { children, player } = this.props
    const currentTrack = player && player.currentTrack

    return (
      <React.Fragment>
        <Header />
        <div id="window">
          <SideBar />
          <Router routes={routes} defaultRoute={'/'} />
          <Player />
        </div>
      </React.Fragment>
    )
  }
}

export default App
