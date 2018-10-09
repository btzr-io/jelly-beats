import createStore from 'stockroom/worker'
import initialState from '@/unistore/initialState'
import cacheActions from '@/unistore/actions/cache'
import streamActions from '@/unistore/actions/stream'
import playerActions from '@/unistore/actions/player'
import favoritesActions from '@/unistore/actions/favorites'
import navigationActions from '@/unistore/actions/navigation'

let store = createStore({ ...initialState })

store.registerActions(store => ({
  ...cacheActions,
  ...playerActions,
  ...navigationActions,
}))

store.registerActions(streamActions)
store.registerActions(favoritesActions)

export default store
