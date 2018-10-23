export default function(store) {
  const getPosition = (target, parent, scroll, placement) => {
    let { top, left, height, width } = target

    if (placement === 'bottom') {
      top += height
    }

    // Align horizontal center
    if (placement === 'top' || placement === 'bottom') {
      left += width * 0.5
    }

    if (placement === 'right') {
      left += width
    }

    // Align vertical center
    if (placement === 'left' || placement === 'right') {
      top += width * 0.5
    }

    const position = {
      top: top - parent.top + scroll.top, //- parent.top + scroll.top,
      left: left - parent.left + scroll.left,
    }

    return position
  }

  const actions = {
    showTooltip(state, { text, target, parent, scroll, placement = 'bottom' }) {
      const position = getPosition(target, parent, scroll, placement)
      return {
        tooltip: {
          text,
          show: true,
          position: { ...position },
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
