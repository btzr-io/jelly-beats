import { h, Component } from 'preact'

export default class Link extends Component {
  constructor() {
    super()
  }

  handleClick(event) {
    // Ignore any click other than a left click
    if (
      (event.button && event.button !== 0) ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.defaultPrevented === true
    ) {
      return
    }
    // Prevent page reload
    event.preventDefault()

    // Execute onClick callback, if it exists
    // this.props.onClick && onClick(event)
  }

  render() {
    const { href, children } = this.props
    return (
      <a href={href} onClick={this.handleClick}>
        {children[0]}
      </a>
    )
  }
}
