import React from 'react'
import css from '@/css/modules/thumbnail.css.module'
import navigate from '@/utils/navigate'

class Card extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { ready: false }
  }

  handleLoad = () => {
    this.setState({ ready: true })
  }

  componentDidMount() {
    const { src } = this.props
  }

  render() {
    const { className, src } = this.props
    const { ready } = this.state
    console.info(ready)

    const thumbnailStyle = {
      backgroundImage: src ? `url(${src})` : 'none',
    }

    return (
      <div className={!ready ? css.thumb : css.thumbReady}>
        <img src={src} onLoad={this.handleLoad} />
        <div className={css.picture} style={thumbnailStyle} />
        <div className={css.overlay}>
          <div className={css.metadata}>{this.props.children}</div>
        </div>
      </div>
    )
  }
}

export default Card
