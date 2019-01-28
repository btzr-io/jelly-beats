import React from 'react'
import * as icons from '@/constants/icons'
import Icon from '@mdi/react'
import Switch from '@/components/common/switch'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { settings, updateSettings } = this.props
    return (
      <div className="page">
        <div className="form">
          <section>
            <h3>Style</h3>
            <Switch
              label={'Adaptive colors'}
              value={settings.adaptiveColors}
              onChange={value => updateSettings('adaptiveColors', value)}
            />
          </section>
          <section>
            <h3>Integrations</h3>
            <Switch
              label={'Discord Rich Presence'}
              value={settings.discord}
              onChange={value => updateSettings('discord', value)}
            />
          </section>
        </div>
      </div>
    )
  }
}

export default View
