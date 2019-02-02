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
    const price = fee ? `${fee.amount.toFixed(2)} ${fee.currency}` : 'FREE'
    return (
      <span className={classnames(className, 'label', { price_label: fee })}>
        {price}
      </span>
    )
  }
}

export default PriceLabel
