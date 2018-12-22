import React from 'react'
import routes from '@/routes'
import Router from '@/components/router'
import Header from '@/components/header'
import Player from '@/components/player'
import SideBar from '@/components/sidebar'
import navigate from '@/utils/navigate'

const TWO_POINT_FIVE_MINUTES = 1000 * 60 * 2.5

class App extends React.PureComponent {
  constructor(props) {
    super(props)
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

  componentDidMount() {
    const { updateBlockHeight } = this.props
    updateBlockHeight()
    setInterval(() => {
      updateBlockHeight()
    }, TWO_POINT_FIVE_MINUTES)
  }

  render() {
    const { children, player } = this.props
    const { showPlayer } = player || {}

    return (
      <React.Fragment>
        <Header />
        <div id="window" className={showPlayer ? 'short' : ''}>
          <SideBar />
          <Router routes={routes} defaultRoute={'/'} />
          <Player />
        </div>
      </React.Fragment>
    )
  }
}

export default App
