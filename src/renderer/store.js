import createStore from 'stockroom'
import StoreWorker from '@/store.worker'

const store = createStore(new StoreWorker())

// Simple debug
store.subscribe(console.log)

export default store
