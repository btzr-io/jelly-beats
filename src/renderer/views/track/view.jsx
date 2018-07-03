import React from 'react'
import Tags from '@/components/tags'
import Button from '@/components/button'
import Player from '@/components/player'
import stream from '@/utils/stream'
import css from '@/css/modules/view.css.module'
import * as icons from '@/constants/icons'

class View extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fileSource: null,
    }
  }

  handleStream(fileSource) {
    this.setState({ fileSource })
  }

  handlePlay(event) {
    const { uri } = this.props.options
    uri && stream(uri, this.handleStream.bind(this))
  }

  render() {
    const { fileSource } = this.state
    const { metadata, uri } = this.props.options
    const { author, title, thumbnail, tags } = metadata || {}

    const thumbnailStyle = {
      backgroundImage: thumbnail ? `url(${thumbnail})` : 'none',
    }

    const track = {
      uri,
      author,
      title,
      thumbnail,
      fileSource,
    }

    return (
      <div className={css.view}>
        <div className={css.container}>
          <div className={css.thumbnail} style={thumbnailStyle} />
          <div className={css.box}>
            <div className={css.metadata}>
              <h1>{title || 'unknown'}</h1>
              <h2>{author || 'unknown'}</h2>
              <Tags tags={tags || []} />
            </div>
            <Button
              label="Play Track"
              icon={icons.PLAY}
              onClick={this.handlePlay.bind(this)}
            />
          </div>
        </div>
        {fileSource && <Player track={track} />}
      </div>
    )
  }
}

export default View
