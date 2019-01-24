import React from 'react'

import Hello from './views/hello'
import Profile from './views/profile'
import Channels from './views/channels'
import Downloads from './views/downloads'
import Favorites from './views/favorites'
import Playlists from './views/playlists'

const routes = [
  {
    path: '/',
    action: () => <Hello />,
  },
  {
    path: '/profile',
    action: ctx => <Profile options={ctx} />,
  },
  {
    path: '/favorites',
    action: ctx => <Favorites options={ctx} />,
  },
  {
    path: '/downloads',
    action: ctx => <Downloads options={ctx} />,
  },
  {
    path: '/playlists',
    action: ctx => <Playlists options={ctx} />,
  },
  {
    path: '/channels',
    action: ctx => <Channels options={ctx} />,
  },
]

export default routes
