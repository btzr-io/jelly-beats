import { h } from 'preact'
import About from './views/about'
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
  {
    path: '/about',
    action: () => <About />,
  },
]

export default routes
