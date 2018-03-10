import { h, render } from 'preact'
import Root from './components/root'
import history from './history'
import styles from './css/index.css'

const container = document.getElementById('app')

render(<Root />, container)

// Init location:
history.push({ hash: '' })
