import React from 'react'
import Icon from '@mdi/react'
import Button from '@/components/button'
import * as icons from '@/constants/icons'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { doNavigate } = this.props
    return (
      <nav className={'header'}>
        <Button
          type={'header-nav'}
          size={'large'}
          icon={icons.LEFT}
          onClick={() => doNavigate('/')}
        />
        <Button type={'header-nav'} size={'large'} icon={icons.RIGHT} disabled />
      </nav>
    )
  }
}

export default Header
