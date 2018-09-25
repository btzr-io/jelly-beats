import createStore from 'stockroom/worker'

let store = createStore({
  count: 0,
})

store.registerActions(store => ({
  // increment: ({ count }) => ({ count: count+1 })
}))

export default store
