import createStore from 'stockroom/worker'
import initialState from '@/unistore/initialState'
import cacheActions from '@/unistore/actions/cache'
import playerActions from '@/unistore/actions/player'
import favoritesActions from '@/unistore/actions/favorites'
import navigationActions from '@/unistore/actions/navigation'

let store = createStore({ ...initialState })

store.registerActions(store => ({
  ...cacheActions,
  ...playerActions,
  ...favoritesActions,
  ...navigationActions,
}))

export default store
