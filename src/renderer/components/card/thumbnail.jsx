import React from 'react'
import Vibrant from 'node-vibrant'
import css from '@/css/modules/thumbnail.css.module'
import navigate from '@/utils/navigate'
import { Lbry } from 'lbry-redux'

class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      color: '#282c37',
    }
  }
  /*
  getMainColor(thumbnail) {
    Vibrant.from(thumbnail)
      .getPalette()
      .then(palette => {
        const { Vibrant, LightMuted } = console.log(palette)
        const color = Vibrant ? Vibrant.getHex() : 'none'
        this.setState({ color, ready: true })
      })
  }
*/
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
    const { color, ready } = this.state

    const thumbnailStyle = {
      backgroundImage: src ? `url(${src})` : 'none',
    }

    return (
      <div className={css.thumb}>
        <div className={css.picture} style={thumbnailStyle} />
        <div className={css.overlay}>{this.props.children}</div>
      </div>
    )
  }
}

export default Card
