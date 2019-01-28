import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'
import {
  HOME as home,
  PLAYLIST_PLUS as playlistPlus,
  HEART_OUTLINE as heart,
  DOWNLOAD_OUTLINE as download,
  SETTINGS as settings,
} from '@/constants/icons'

const NavLink = ({ icon, label, active, action, badge }) => (
  <div
    onClick={action}
    className={classnames('nav__link', { 'nav__link--active': active })}
  >
    <div className="link__body">
      {icon && <Icon className="icon link__icon" path={icon} />}
      {label && <span className="link__label">{label}</span>}
    </div>
    <div className="link__actions">
      {badge && <div className="link__badge">{badge}</div>}
    </div>
  </div>
)

class SideBar extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  getNavLink = ({ path, label, icon, idx }) => {
    const { doNavigate, navigation } = this.props
    const { currentPage } = navigation || {}
    return (
      <NavLink
        action={() => doNavigate(path)}
        label={label}
        icon={icon}
        active={currentPage == path}
        key={`${idx}_navLink`}
      />
    )
  }

  render() {
    const navLinks = [
      {
        label: 'Home',
        path: '/',
        icon: home,
      },
      {
        label: 'Playlists',
        path: '/playlists',
        icon: playlistPlus,
      },
      {
        label: 'Favorites',
        path: '/favorites',
        icon: heart,
      },
      {
        label: 'Downloads',
        path: '/downloads',
        icon: download,
      },
      {
        label: 'Settings',
        path: '/settings',
        icon: settings,
      },
    ]
    return (
      <div className="sidebar">
        <div className="nav__links">
          {navLinks.map((item, idx) => this.getNavLink({ ...item, idx }))}
        </div>
      </div>
    )
  }
}

export default SideBar
