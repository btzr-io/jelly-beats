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

  isActive = (path, query) => {
    const { currentPage, currentQuery } = this.props.navigation || {}
    return currentPage === path
  }

  getNavLink = ({ path, query, label, icon, idx }) => {
    const { doNavigate } = this.props
    return (
      <NavLink
        action={() => doNavigate(path, query)}
        label={label}
        icon={icon}
        active={this.isActive(path, query)}
        key={`${idx}_navLink`}
      />
    )
  }

  render() {
    const navLinks = [
      {
        icon: home,
        path: '/',
        label: 'Home',
      },
      {
        icon: playlistPlus,
        path: '/playlists',
        label: 'Playlists',
      },
      {
        icon: heart,
        path: '/favorites',
        label: 'Favorites',
      },
      {
        icon: download,
        path: '/downloads',
        label: 'Downloads',
      },
      {
        icon: settings,
        path: '/settings',
        label: 'Settings',
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
