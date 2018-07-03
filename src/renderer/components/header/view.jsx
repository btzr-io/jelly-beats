import React from 'react'
import css from '@/css/modules/header.css.module'
import navigate from '@/utils/navigate'
import Link from '@/components/link'
import Icon from '@/components/common/icon'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <nav className={css.header}>
        <Link href="/">{'< GO BACK'}</Link>
      </nav>
    )
  }
}

export default Header
