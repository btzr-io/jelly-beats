import React from 'react'

export default class DateTime extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      date: null,
    }
  }

  simulatedDate = () => {
    const { latestBlock, blockHeight } = this.props
    const difference = latestBlock - blockHeight
    const msSincePublish = difference * 2.5 * 60 * 1000 // Number of blocks * 2.5 minutes in ms
    const publishDate = Date.now() - msSincePublish
    this.setState({ date: publishDate ? new Date(publishDate) : null })
  }

  componentDidMount() {
    this.simulatedDate()
  }

  render() {
    const { date } = this.state
    return <span>{date && date.toString()}</span>
  }
}
