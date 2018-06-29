import React from 'react'

class App extends React.Component {
  constructor() {
    super()
  }

  render() {
    const { children } = this.props
    return <div id="window">{children[0]}</div>
  }
}

export default App
