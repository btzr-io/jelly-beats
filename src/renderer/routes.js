import { h } from 'preact'

const routes = [
  {
    path: '', // optional
    action: () => <h1>Home</h1>,
  },
  {
    path: '/test',
    action: () => <h1>Hello</h1>,
  },
]

export default routes
