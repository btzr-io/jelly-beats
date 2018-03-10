import { h, render } from 'preact'
import Root from './components/root'
import history from './history'
const container = document.getElementById('app')

render(<Root />, container)

var stateObj = { foo: 'bar' }
history.push({ hash: '' })
