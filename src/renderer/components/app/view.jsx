import { h, render, Component } from 'preact'
// Tell Babel to transform JSX into h() calls:
/** @jsx h */

class App extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div id="window">
        <h1>Electron-app</h1>
      </div>
    )
  }
}

export default App
