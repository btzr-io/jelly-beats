import { h, Component } from 'preact'

class App extends Component {
  constructor() {
    super()
  }

  render() {
    const { children } = this.props
    return (
      <div id="window">
        <h1>Title</h1>
        {children[0]}
      </div>
    )
  }
}

export default App
