import React from 'react'
import routes from '@/routes'
import Router from '@/components/router'
import Header from '@/components/header'
import SideBar from '@/components/sidebar'

class App extends React.Component {
  constructor() {
    super()
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
