import createStore from 'stockroom/worker'

let store = createStore({
  currentPage: '/',
  currentQuery: {},
})

store.registerActions(store => ({
  doNavigate: ({ currentPage }, path, query) => ({
    currentPage: path,
    currentQuery: query,
  }),
}))

export default store
