import React from 'react'
import classnames from 'classnames'

class PriceLabel extends React.PureComponent {
  static defaultProps = {
    className: 'label',
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { type, fee, className } = this.props
    const price = fee && `${fee.amount.toFixed(2)} ${fee.currency}`
    return (
      <span
        className={classnames(className, 'price_label', {
          'price_label--free': !fee,
        })}
      >
        {price || 'FREE'}
      </span>
    )
  }
}

export default PriceLabel
