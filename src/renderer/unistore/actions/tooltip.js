export default function(store) {
  const actions = {
    showTooltip(state, { text, position, placement }) {
      // Get position
      return {
        tooltip: {
          text,
          show: true,
          position,
          placement,
        },
      }
    },
    hideTooltip(state) {
      return { tooltip: { show: false } }
    },
  }

  return actions
}
