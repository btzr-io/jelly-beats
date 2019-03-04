import React from 'react'
import Icon from '@mdi/react'

import { CHECKBOX_MARK } from '@/constants/icons'

const Checkbox = ({ name, checked, onChange }) => (
  <label className="checkbox-container">
    <input type="checkbox" name={name} checked={checked} onChange={onChange} />
    <span className="checkbox">
      <Icon className="icon link__icon" path={CHECKBOX_MARK} />
    </span>
  </label>
)

export default Checkbox
