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
    const { doNavigate, currentChannel } = this.props
    const { uri, nickname, thumbnail } = currentChannel || {}

    return (
      <Button
        type={'drop'}
        iconRight={icons.MENU_DOWN}
        active={this.state.active}
        onClick={this.toggleMenu}
      >
        {thumbnail && <img className={'profile-thumbnail'} src={thumbnail} />}
        <span className={'profile-label'}>{nickname}</span>
        <div className={'drop-menu'}>
          <div className={'drop-item'} onClick={() => doNavigate('/profile', { uri })}>
            Profile
          </div>
          <div className={'drop-item'} onClick={() => doNavigate('/channels')}>
            Switch channel
          </div>
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
    const {
      doNavigate,
      currentChannel,
      doNavigateForward,
      doNavigateBackward,
      backwardNavigation,
      forwardNavigation,
    } = this.props

    return (
      <nav className={'header'}>
        <div>
          <Button
            type={'header-nav'}
            size={'large'}
            icon={icons.LEFT}
            onClick={() => doNavigateBackward()}
            disabled={!backwardNavigation}
          />
          <Button
            type={'header-nav'}
            size={'large'}
            icon={icons.RIGHT}
            onClick={() => doNavigateForward()}
            disabled={!forwardNavigation}
          />
        </div>
        <div>
          {currentChannel && (
            <DropMenu currentChannel={currentChannel} doNavigate={doNavigate} />
          )}
        </div>
      </nav>
    )
  }
}

export default Header
