import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'
import {
  HOME as home,
  PLAYLIST_PLUS as playlistPlus,
  HEART_OUTLINE as heart,
  DOWNLOAD_OUTLINE as download,
  SETTINGS as settings,
  PODCAST as podcast,
  GROUP_DOWN as menuDown,
  GROUP_RIGHT as menuRight,
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

const NavGroup = ({ title, links, action, active }) => (
  <div className="nav__group">
    <div className="nav__group--header" onClick={action}>
      <Icon
        className="icon"
        color={'var(--subtext-color)'}
        path={active ? menuDown : menuRight}
      />
      <span className="nav__group--title">{title}</span>
    </div>
    <div className={classnames('nav__links', { 'nav__links--hidden': !active })}>
      {links}
    </div>
  </div>
)

class SideBar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      show_Discover: true,
      show_Collections: true,
      show_Application: true,
    }
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

  toggle = page => {
    this.setState(prevState => ({
      [`show_${page}`]: !prevState[`show_${page}`],
    }))
  }

  render() {
    const navLinks = [
      {
        icon: home,
        path: '/',
        label: 'Home',
      },
      {
        icon: podcast,
        path: '/podcasts',
        label: 'Podcasts',
      },
    ]

    const collectionLinks = [
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
    ]

    const appLinks = [
      {
        icon: settings,
        path: '/settings',
        label: 'Settings',
      },
    ]

    const { show_Discover, show_Application, show_Collections } = this.state

    return (
      <div className="sidebar">
        <NavGroup
          title={'DISCOVER'}
          active={show_Discover}
          action={() => this.toggle('Discover')}
          links={navLinks.map((item, idx) => this.getNavLink({ ...item, idx }))}
        />
        <NavGroup
          title={'COLLECTIONS'}
          active={show_Collections}
          action={() => this.toggle('Collections')}
          links={collectionLinks.map((item, idx) => this.getNavLink({ ...item, idx }))}
        />
        <NavGroup
          title={'APPLICATION'}
          active={show_Application}
          action={() => this.toggle('Application')}
          links={appLinks.map((item, idx) => this.getNavLink({ ...item, idx }))}
        />
      </div>
    )
  }
}

export default SideBar
