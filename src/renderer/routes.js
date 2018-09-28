import React from 'react'

import Hello from './views/hello'
import Track from './views/track'
import Favorites from './views/favorites'
import Playlists from './views/playlists'

const routes = [
  {
    path: '/',
    action: () => <Hello />,
  },
  {
    path: '/track',
    action: ctx => <Track options={ctx} />,
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
