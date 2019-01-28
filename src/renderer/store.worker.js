import createStore from 'stockroom/worker'
import initialState from '@/unistore/initialState'
import cacheActions from '@/unistore/actions/cache'
import walletActions from '@/unistore/actions/wallet'
import playerActions from '@/unistore/actions/player'
import accountActions from '@/unistore/actions/account'
import tooltipActions from '@/unistore/actions/tooltip'
import settingsActions from '@/unistore/actions/settings'
import favoritesActions from '@/unistore/actions/favorites'
import navigationActions from '@/unistore/actions/navigation'

let store = createStore({ ...initialState })

store.registerActions(store => ({
  ...cacheActions,
}))
store.registerActions(walletActions)
store.registerActions(playerActions)
store.registerActions(accountActions)
store.registerActions(tooltipActions)
store.registerActions(settingsActions)
store.registerActions(favoritesActions)
store.registerActions(navigationActions)

export default store
