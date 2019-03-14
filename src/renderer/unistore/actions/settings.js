export default function(store) {
  const actions = {
    updateSettings(state, name, value) {
      return { settings: { ...state.settings, [name]: value } }
    },
  }

  return actions
}
