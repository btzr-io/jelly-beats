import React, { Component } from 'react'
import ReactSwitch from 'react-switch'

class Switch extends Component {
  constructor() {
    super()
  }

  render() {
    const { label, value, onChange, targetId } = this.props

    const style = getComputedStyle(document.getElementById('window'))
    const mainColor = style.getPropertyValue('--main-color').trim()

    return (
      <label className={'form-row'} htmlFor={targetId}>
        <span className={'form-label'}>{label}</span>
        <ReactSwitch
          onChange={onChange}
          checked={value}
          checkedIcon={false}
          uncheckedIcon={false}
          height={16}
          width={32}
          onColor={mainColor}
          handleDiameter={18}
          id={targetId}
        />
      </label>
    )
  }
}

export default Switch
