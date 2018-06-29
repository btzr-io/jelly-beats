import React from 'react'
import Tags from '@root/components/tags'
import Button from '@root/components/button'
import css from '@root/css/modules/view.css.module'

class View extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { metadata } = this.props.options
    const thumbnailStyle = {
      backgroundImage: metadata ? `url(${metadata.thumbnail})` : 'none',
    }
    return (
      <div className={css.view}>
        <div className={css.container}>
          <div className={css.thumbnail} style={thumbnailStyle} />
          <div className={css.metadata}>
            <h1>{metadata ? metadata.title : 'unknown'}</h1>
            <h2>{metadata ? metadata.author : 'unknown'}</h2>
            {metadata && <Tags tags={metadata.tags} />}
            <Button label="Play Now" />
          </div>
        </div>
        {/* <div className={css.backdrop} style={thumbnailStyle} /> */}
      </div>
    )
  }
}

export default View
