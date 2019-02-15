import createStore from 'stockroom'
import persistStore from 'unissist'
import StoreWorker from '@/store.worker'

// AsyncStorage Adapter
import localStorageAdapter from 'unissist/integrations/localStorageAdapter'

const IS_DEV = process.env.NODE_ENV !== 'production'

const store = createStore(new StoreWorker())

const adapter = localStorageAdapter()

// Debug store events
IS_DEV && store.subscribe(console.log)

// Default values except migration
let config = {
  version: 1,
  debounceTime: 100,
  // takes in the current state and returns the state to be persisted
  map: ({ cache, settings, collections, latestBlock }) => ({
    cache,
    settings,
    collections,
    latestBlock,
  }),
}

persistStore(store, adapter, config)

export default store
