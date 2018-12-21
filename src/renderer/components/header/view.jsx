import React from 'react'
import Icon from '@mdi/react'
import Button from '@/components/button'
import * as icons from '@/constants/icons'

class DropMenu extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      active: false,
    }
  }

  toggleMenu = () => {
    this.setState({ active: !this.state.active })
  }

  render() {
    const { doNavigate } = this.props

    return (
      <Button
        type={'drop'}
        iconRight={icons.MENU_DOWN}
        active={this.state.active}
        onClick={this.toggleMenu}
      >
        <img
          className={'profile-thumbnail'}
          width="22"
          height="22"
          src="https://avatars0.githubusercontent.com/u/14793624?s=460&v=4"
        />
        <span className={'profile-label'}>{'btzr'}</span>
        <div className={'drop-menu'}>
          <div
            className={'drop-item'}
            onClick={() =>
              doNavigate('/profile', {
                uri: '@vicentebalderas#b4969eb15b0fe0cb538d7ea3c88089230cd0f8cc',
              })
            }
          >
            Profile
          </div>
          <div className={'drop-item'}>Switch channel</div>
        </div>
      </Button>
    )
  }
}

class Header extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { doNavigate } = this.props
    return (
      <nav className={'header'}>
        <div>
          <Button
            type={'header-nav'}
            size={'large'}
            icon={icons.LEFT}
            onClick={() => doNavigate('/')}
          />
          <Button type={'header-nav'} size={'large'} icon={icons.RIGHT} disabled />
        </div>
        <div>
          <DropMenu doNavigate={doNavigate} />
        </div>
      </nav>
    )
  }
}

export default Header
