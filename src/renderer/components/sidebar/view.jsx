import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'
import navigate from '@/utils/navigate'
import Button from '@/components/button'
import * as icons from '@/constants/icons'

const NavLink = ({ icon, label, active }) => {
  return (
    <div className={classnames('nav__link', { 'nav__link--active': active })}>
      {icon && <Icon className="icon link__icon" path={icon} />}
      {label && <span className="link__label">{label}</span>}
    </div>
  )
}

class SideBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="sidebar">
        <div className="nav__links">
          <NavLink label="Home" icon={icons.HOME} active={true} />
          <NavLink label="Playlists" icon={icons.PLAYLIST_PLUS} />
          <NavLink label="Favorites" icon={icons.HEART} />
        </div>
      </div>
    )
  }
}

export default SideBar
