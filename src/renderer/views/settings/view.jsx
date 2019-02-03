import React from 'react'
import * as icons from '@/constants/icons'
import Icon from '@mdi/react'
import Switch from '@/components/common/switch'
import Loader from '@/components/common/loader'
import ConnectionStatus from '@/components/common/connectionStatus'
import EmptyState from '@/components/common/emptyState'
import Lbry from '@/utils/lbry'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      status: null,
      version: null,
    }
  }

  componentDidMount() {
    Lbry.version()
      .then(res => {
        const { lbrynet_version: version } = res
        this.setState({ version })
      })
      .catch(error => {
        this.setState({ status: 'disconnected' })
      })
  }

  render() {
    const { status, version } = this.state
    const { settings, updateSettings, network } = this.props
    const { connection } = network || {}

    return (
      <div className="page">
        <div className="form">
          <section>
            <h3 className={'section--title'}>Style</h3>
            <Switch
              label={'Adaptive colors'}
              targetId={'first-switch'}
              value={settings.adaptiveColors}
              onChange={value => updateSettings('adaptiveColors', value)}
            />
          </section>
          <section>
            <h3 className={'section--title'}>Integrations</h3>
            <Switch
              label={'Discord Rich Presence'}
              value={settings.discord}
              targetId={'second-switch'}
              onChange={value => updateSettings('discord', value)}
            />
          </section>
          <section>
            <h3 className={'section--title'}>Network</h3>
            <div className={'form-row'}>
              <span className={'form-label form-row--key'}>
                {'LBRY daemon ' + (version ? `(${version})` : '')}
              </span>
              <span className={'form-row--value'}>
                <ConnectionStatus connection={connection} />
              </span>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default View
