import React from 'react'

const Component = ({ label, onClick }) => {
  return (
    <span className={'label-link'} onClick={onClick}>
      {label}
    </span>
  )
}

const areEqual = (prevProps, nextProps) => {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  return prevProps.label === nextProps.label
}

export default React.memo(Component, areEqual)
