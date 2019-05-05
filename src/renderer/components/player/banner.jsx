import clsx from 'clsx'
import React from 'react'
import { connect } from 'unistore/react'
import { WARNING as iconWarning, CLOSE as iconClose } from '@/constants/icons'

import Icon from '@mdi/react'

class Banner extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  hide = () => {
    const { hidePlayerBanner } = this.props
    hidePlayerBanner()
  }
  render() {
    const { icon, message, visible } = this.props
    return (
      <div className={clsx('banner', !visible && 'banner-hide')}>
        <div className={'banner--content'}>
          <Icon className={'icon banner--icon'} path={iconWarning} />
          <div className={'banner--message'}>{message}</div>
        </div>
        <div className={'banner--actions'}>
          <div onClick={this.hide}>
            <Icon className={'icon banner--icon'} path={iconClose} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  (state, props) => {
    const { player } = state
    const { showBanner: visible, bannerMessage: message } = player
    return { visible, message }
  },
  {
    hidePlayerBanner: 'hidePlayerBanner',
    showPlayerBanner: 'showPlayerBanner',
    updatePlayerStatus: 'updatePlayerStatus',
  }
)(Banner)
