import createStore from 'stockroom'
import StoreWorker from '@/store.worker'

const IS_DEV = process.env.NODE_ENV !== 'production'

const store = createStore(new StoreWorker())

// Debug store events
IS_DEV && store.subscribe(console.log)

export default store
