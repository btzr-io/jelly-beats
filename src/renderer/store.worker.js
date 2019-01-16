import createStore from 'stockroom/worker'
import initialState from '@/unistore/initialState'
import cacheActions from '@/unistore/actions/cache'
import walletActions from '@/unistore/actions/wallet'
import streamActions from '@/unistore/actions/stream'
import playerActions from '@/unistore/actions/player'
import tooltipActions from '@/unistore/actions/tooltip'
import favoritesActions from '@/unistore/actions/favorites'
import navigationActions from '@/unistore/actions/navigation'

let store = createStore({ ...initialState })

store.registerActions(store => ({
  ...cacheActions,
}))

store.registerActions(walletActions)
store.registerActions(playerActions)
store.registerActions(streamActions)
store.registerActions(tooltipActions)
store.registerActions(favoritesActions)
store.registerActions(navigationActions)

export default store
