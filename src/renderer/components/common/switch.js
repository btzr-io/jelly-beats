import React, { Component } from 'react'
import ReactSwitch from 'react-switch'

class Switch extends Component {
  constructor() {
    super()
  }

  render() {
    const { label, value, onChange } = this.props

    const style = getComputedStyle(document.documentElement)
    const mainColor = style.getPropertyValue('--color-primary')

    return (
      <label className={'form-row'} htmlFor="normal-switch">
        <span className={'form-label'}>{label}</span>
        <ReactSwitch
          onChange={onChange}
          checked={value}
          checkedIcon={false}
          uncheckedIcon={false}
          height={18}
          width={34}
          onColor={mainColor}
          handleDiameter={20}
          id="normal-switch"
        />
      </label>
    )
  }
}

export default Switch
