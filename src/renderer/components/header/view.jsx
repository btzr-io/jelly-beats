import React from 'react'
import css from '@/css/modules/header.css.module'
import navigate from '@/utils/navigate'
import Link from '@/components/link'
import Icon from '@mdi/react'

import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <nav className={css.header}>
        <Link href="/">
          <Icon path={mdiChevronLeft} size={0.85} color={'#FFFFFF'} />
        </Link>
        <Link href="/">
          <Icon path={mdiChevronRight} size={0.85} color={'#FFFFFF'} />
        </Link>
      </nav>
    )
  }
}

export default Header
