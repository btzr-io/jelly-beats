import React from 'react'
import css from '@/css/modules/thumbnail.css.module'
import navigate from '@/utils/navigate'
import { Lbry } from 'lbry-redux'

class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ready: false }
  }

  componentDidMount() {
    const { src } = this.props
    const thumbnail = new Image()
    thumbnail.src = src
    thumbnail.onload = event => {
      this.setState({ ready: true })
    }
  }

  render() {
    const { className, src } = this.props
    const { ready } = this.state

    const thumbnailStyle = {
      backgroundImage: src ? `url(${src})` : 'none',
    }

    return (
      <div className={css.thumb}>
        <div className={css.picture} style={thumbnailStyle} />
        <div className={css.overlay}>
          <div className={css.metadata}>{this.props.children}</div>
        </div>
      </div>
    )
  }
}

export default Card
