import React from 'react'
import css from '@root/css/modules/header.css.module'
import navigate from '@root/utils/navigate'
import Link from '@root/components/link'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <nav className={css.header}>
        <Link href="/"> {'<'}</Link>
      </nav>
    )
  }
}

export default Header
