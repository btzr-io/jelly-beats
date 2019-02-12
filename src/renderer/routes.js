import React from 'react'

import Hello from './views/hello'
import Profile from './views/profile'
import Settings from './views/settings'
import Channels from './views/channels'
import Downloads from './views/downloads'
import Favorites from './views/favorites'
import Playlist from './views/playlist'
import Podcasts from './views/podcasts'

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
    path: '/playlist',
    action: ctx => <Playlist options={ctx} />,
  },
  {
    path: '/playlists',
    action: ctx => <Playlists options={ctx} />,
  },
  {
    path: '/settings',
    action: ctx => <Settings options={ctx} />,
  },
  {
    path: '/channels',
    action: ctx => <Channels options={ctx} />,
  },
  {
    path: '/podcasts',
    action: ctx => <Podcasts options={ctx} />,
  },
]

export default routes
