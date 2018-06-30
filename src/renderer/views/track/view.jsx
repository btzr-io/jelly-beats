import React from 'react'
import Tags from '@/components/tags'
import Button from '@/components/button'
import Player from '@/components/player'
import stream from '@/utils/stream'
import css from '@/css/modules/view.css.module'

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
    const thumbnailStyle = {
      backgroundImage: metadata ? `url(${metadata.thumbnail})` : 'none',
    }
    return (
      <div className={css.view}>
        <div className={css.container}>
          <div className={css.thumbnail} style={thumbnailStyle} />
          <div className={css.box}>
            <div className={css.metadata}>
              <h1>{metadata ? metadata.title : 'unknown'}</h1>
              <h2>{metadata ? metadata.author : 'unknown'}</h2>
              {metadata && <Tags tags={metadata.tags} />}
            </div>
            <Button label="Play Track" onClick={this.handlePlay.bind(this)} />
          </div>
        </div>
        {fileSource && <Player fileSource={fileSource} />}
      </div>
    )
  }
}

export default View
