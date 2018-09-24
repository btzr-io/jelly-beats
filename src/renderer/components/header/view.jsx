import React from 'react'
import Icon from '@mdi/react'
import navigate from '@/utils/navigate'
import Button from '@/components/button'
import * as icons from '@/constants/icons'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <nav className={'header'}>
        <Button
          type={'header-nav'}
          size={'normal'}
          icon={icons.LEFT}
          onClick={() => navigate('/')}
        />
        <Button type={'header-nav'} size={'normal'} icon={icons.RIGHT} disabled />
      </nav>
    )
  }
}

export default Header
