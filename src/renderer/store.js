import createStore from 'stockroom'
import StoreWorker from '@/store.worker'

const isDevelopment = process.env.NODE_ENV !== 'production'

const store = createStore(new StoreWorker())

// Debug store events
isDevelopment && store.subscribe(console.log)

export default store
