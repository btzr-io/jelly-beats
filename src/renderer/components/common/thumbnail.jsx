import React from 'react'
import clsx from 'clsx'

class Thumbnail extends React.PureComponent {
  static defaultProps = {
    src: null,
    showOverlay: false,
  }

  constructor(props) {
    super(props)
    this.state = { ready: false }
  }

  handleError = () => {
    this.setState({ ready: true })
  }

  handleLoad = () => {
    this.setState({ ready: true })
  }

  render() {
    const { ready } = this.state
    const { src, className } = this.props

    const thumbnailStyle = {
      backgroundImage: src ? `url(${src})` : 'none',
    }

    return (
      <div className={clsx('thumbnail', { 'thumbnail--ready': ready }, className)}>
        <div className={'thumbnail--picture'} style={thumbnailStyle}>
          {this.props.children}
        </div>
        <img
          src={src}
          style={{ display: 'none' }}
          onLoad={this.handleLoad}
          onError={this.handleError}
        />
      </div>
    )
  }
}

export default Thumbnail
