import { h } from 'preact'
import Load from './views/load'

const routes = [
  {
    path: '', // optional
    action: () => <Load />,
  },
  {
    path: '/test',
    action: () => <h1>Hello</h1>,
  },
]

export default routes
