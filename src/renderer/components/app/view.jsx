import React from 'react'
import routes from '@/routes'
import Router from '@/components/router'
import Header from '@/components/header'

class App extends React.Component {
  constructor() {
    super()
  }

  render() {
    const { children } = this.props
    return (
      <div id="window">
        <Header />
        <Router routes={routes} defaultRoute={'/'} />
      </div>
    )
  }
}

export default App
