import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'
import navigate from '@/utils/navigate'
import Button from '@/components/button'
import * as icons from '@/constants/icons'

const NavLink = ({ icon, label, active, action, badge }) => {
  return (
    <div
      onClick={action}
      className={classnames('nav__link', { 'nav__link--active': active })}
    >
      <div>
        {icon && <Icon className="icon link__icon" path={icon} />}
        {label && <span className="link__label">{label}</span>}
      </div>
      <div>{badge && <div className="link__badge">{badge}</div>}</div>
    </div>
  )
}

class SideBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { doNavigate, currentPage } = this.props
    return (
      <div className="sidebar">
        <div className="nav__links">
          <NavLink
            action={() => doNavigate('/')}
            label="Home"
            icon={icons.HOME}
            active={currentPage == '/'}
          />
          <NavLink
            label="Playlists"
            badge={3}
            action={() => doNavigate('/playlists')}
            icon={icons.PLAYLIST_PLUS}
            active={currentPage == '/playlists'}
          />
          <NavLink
            action={() => doNavigate('/favorites')}
            label="Favorites"
            icon={icons.HEART}
            active={currentPage == '/favorites'}
          />
        </div>
      </div>
    )
  }
}

export default SideBar
