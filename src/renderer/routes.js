import { h } from 'preact'
import Hello from './views/hello'
import Splash from './views/splash'

const routes = [
  {
    path: '', // optional
    action: () => <Splash />,
  },
  {
    path: '/hello',
    action: () => <Hello />,
  },
]

export default routes
