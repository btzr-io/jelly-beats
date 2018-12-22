import React from 'react'
import * as icons from '@/constants/icons'
import DateTime from '@/components/dateTime'
import Icon from '@mdi/react'

const thumbnail =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Beethoven_Piano_Sonata_14_-_title_page_1802.jpg/800px-Beethoven_Piano_Sonata_14_-_title_page_1802.jpg'

class TrackWidget extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { author, title, thumbnail } = this.props
    const thumbnailStyle = {
      backgroundImage: `url(${thumbnail})`,
    }

    return (
      <div className="track-widget">
        <div className="track-widget--thumbnail" style={thumbnailStyle} />
        <div className="track-widget--content">
          <div className="track-widget--title">{title}</div>
          <div className="track-widget--author">{author}</div>
        </div>
      </div>
    )
  }
}

class TimeEvent extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { action, author, block, content } = this.props
    return (
      <div className="event">
        <div className="event--header">
          <div className="event--title">
            <span className="event--author">{author}</span>
            <span className="event-action">{action}</span>
          </div>
          <div className="event--date">
            <DateTime blockHeight={block} />
          </div>
          <div className="event--point" />
        </div>
        {content && <div className="event--description" />}
      </div>
    )
  }
}

class TimeLine extends React.PureComponent {
  static defaultProps = {
    events: [],
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { events } = this.props
    return (
      <div className="time-line">
        {events.map((eventData, key) => (
          <TimeEvent {...eventData} key={key} />
        ))}
      </div>
    )
  }
}

export default TimeLine
