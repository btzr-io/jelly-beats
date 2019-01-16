export default function(store) {
  const actions = {
    doNavigate(state, path, query) {
      const { currentPage } = state.navigation

      // Prevent history duplication
      if (currentPage === path && !query) return state

      // Generate page data
      const page = { currentPage: path, currentQuery: query || {} }

      return {
        history: {
          ...state.history,
          stack: [...state.history.stack, page],
          forward: [],
        },
        navigation: { ...state.navigation, ...page },
      }
    },

    doNavigateForward(state) {
      const { stack, forward } = state.history

      // Clone stacks
      const historyStack = [...stack]
      const forwardStack = [...forward]

      // Get last index
      const top = () => historyStack.length - 1
      const topForward = () => forwardStack.length - 1

      if (topForward() > -1) {
        const nextPage = forwardStack.pop()

        // store forward page
        historyStack.push(nextPage)

        return {
          history: {
            ...state.history,
            stack: [...historyStack],
            forward: [...forwardStack],
          },
          navigation: { ...state.navigation, ...nextPage },
        }
      }
    },

    doNavigateBackward(state) {
      const { stack, forward } = state.history

      // Clone stacks
      const historyStack = [...stack]
      const forwardStack = [...forward]

      // Get last index
      const top = () => historyStack.length - 1

      if (top() > -1) {
        const last = historyStack.pop()
        const page = historyStack[top()]

        // store last page
        forwardStack.push(last)

        return {
          history: {
            ...state.history,
            stack: [...historyStack],
            forward: [...forwardStack],
          },
          navigation: { ...state.navigation, ...page },
        }
      }
    },
  }

  return actions
}
