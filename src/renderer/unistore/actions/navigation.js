export default {
  doNavigate(state, path, query) {
    return {
      navigation: {
        currentPage: path,
        currentQuery: query || {},
      },
    }
  },
}
