import React from 'react'
import css from '@/css/modules/card.css.module'

import { Lbry } from 'lbry-redux'

const Tag = ({ name }) => <span className={css.tag}>{name}</span>

class Tags extends React.Component {
  render() {
    const { tags } = this.props
    return <div className={css.tags}>{tags.map(tag => <Tag name={tag} key={tag} />)}</div>
  }
}

export default Tags
