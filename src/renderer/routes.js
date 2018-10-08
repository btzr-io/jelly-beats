import React from 'react'

import Hello from './views/hello'
import Favorites from './views/favorites'
import Playlists from './views/playlists'

const routes = [
  {
    path: '/',
    action: () => <Hello />,
  },
  {
    path: '/favorites',
    action: ctx => <Favorites options={ctx} />,
  },
  {
    path: '/playlists',
    action: ctx => <Playlists options={ctx} />,
  },
]

export default routes
