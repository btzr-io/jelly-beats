import React from 'react'

import Hello from './views/hello'
import Track from './views/track'

const routes = [
  {
    path: '/',
    action: () => <Hello />,
  },
  {
    path: '/track',
    action: ctx => <Track options={ctx} />,
  },
]

export default routes
