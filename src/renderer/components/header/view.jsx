import React from 'react'
import css from '@/css/modules/header.css.module'
import navigate from '@/utils/navigate'
import Link from '@/components/link'
import Icon from '@mdi/react'
import * as icons from '@/constants/icons'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <nav className={css.header}>
        <Link href="/">
          <Icon path={icons.LEFT} size={0.85} color={'#FFFFFF'} />
        </Link>
        <Link href="/">
          <Icon path={icons.RIGHT} size={0.85} color={'#FFFFFF'} />
        </Link>
      </nav>
    )
  }
}

export default Header
