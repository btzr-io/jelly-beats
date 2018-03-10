import { h } from 'preact'
import SplashScreen from './views/splash'

const routes = [
  {
    path: '', // optional
    action: () => <SplashScreen />,
  },
  {
    path: '/test',
    action: () => <h1>Hello world!</h1>,
  },
]

export default routes
