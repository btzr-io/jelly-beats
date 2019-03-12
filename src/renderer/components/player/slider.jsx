import React from 'react'
import Slider from 'rc-slider'
import css from '@/css/modules/player.css.module'

class RangeSlider extends React.Component {
  constructor(props) {
    super(props)
    const { value } = this.props
    this.state = { value, shouldUpdate: true }
  }

  setValue(e) {
    this.setState({ value: e })
  }

  update() {
    this.props.onChange(this.state.value)
    this.setState({ shouldUpdate: true })
  }

  stopUpdate() {
    this.setState({ shouldUpdate: false })
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props
    const { shouldUpdate } = this.state
    if (prevProps.value !== value) {
      shouldUpdate && this.setValue(value)
    }
  }

  render() {
    const { value } = this.state
    const { max, disabled, buffered } = this.props
    const isDisabled = disabled || !max || max === 0
    return (
      <div className={'Slider'}>
        <div
          className={'buffer'}
          style={{ display: isDisabled ? 'none' : 'block', width: buffered + '%' }}
        />
        <Slider
          className={css.seek}
          defaultValue={0}
          min={0}
          max={max}
          value={value}
          onBeforeChange={this.stopUpdate.bind(this)}
          onChange={this.setValue.bind(this)}
          onAfterChange={this.update.bind(this)}
          disabled={isDisabled}
        />
      </div>
    )
  }
}

export default RangeSlider
