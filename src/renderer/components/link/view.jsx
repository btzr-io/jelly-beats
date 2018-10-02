import React from 'react'
import history from '@/history'

export default class Link extends React.PureComponent {
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
    // Get href
    const { href } = this.props
    //Go to location:
    href && history.push({ hash: href })
  }

  render() {
    const { href, children } = this.props
    return (
      <a href={href} onClick={event => this.handleClick(event)}>
        {children}
      </a>
    )
  }
}
