import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Icon extends React.PureComponent {
  static defaultProps = {
    size: '1x',
    prefix: 'fas',
  }

  constructor() {
    super()
  }

  render() {
    const { icon, size, prefix, className } = this.props

    return (
      <FontAwesomeIcon
        size={size}
        icon={[prefix, icon]}
        className={className}
        fixedWidth
      />
    )
  }
}

export default Icon
