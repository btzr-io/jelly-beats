import React from 'react'
import classnames from 'classnames'
import Button from '@/components/button'
import * as icons from '@/constants/icons'

class ChannelCard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { uri, action, isActive, channelData, doNavigate } = this.props

    const { name, nickname, thumbnail } = channelData || {}

    const avatarImage = {
      backgroundImage: `url(${thumbnail})`,
    }

    return (
      <div
        className={classnames('card', { 'card--active': isActive })}
        onClick={() => action()}
      >
        {thumbnail && <div className={'card--avatar'} style={avatarImage} />}
        <p onClick={() => doNavigate('/profile', { uri })} label={'link--label'}>
          {nickname}
        </p>
        <Button icon={icons.EDIT} label={'Edit'} disabled={false} />
      </div>
    )
  }
}

export default ChannelCard
