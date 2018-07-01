import React from 'react'
import Slider from 'rc-slider'
import css from '@/css/modules/player.css.module'
/*
max={this.state.duration}
value={this.state.currentTime}
onBeforeChange={this.stopTimeUpdate}
*/
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
    const { max } = this.props
    return (
      <Slider
        className={css.seek}
        defaultValue={0}
        min={0}
        max={this.props.max}
        value={this.state.value}
        onBeforeChange={this.stopUpdate.bind(this)}
        onChange={this.setValue.bind(this)}
        onAfterChange={this.update.bind(this)}
        disabled={!max || max === 0}
      />
    )
  }
}

export default RangeSlider
