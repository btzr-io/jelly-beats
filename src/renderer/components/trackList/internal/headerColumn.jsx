import React from 'react'
import { connect } from 'unistore/react'
import classname from 'classnames'
import Icon from '@mdi/react'
import * as SortDirection from '@/constants/sortDirection'
import { ARROW_UP, ARROW_DOWN } from '@/constants/icons'

const HeaderColumn = React.memo(
  ({
    dataKey,
    cellRender,
    isAction,
    onSort,
    sortBy,
    sortDirection,
    width,
    disabledSort,
  }) => {
    let sortIndicator

    if (sortDirection == SortDirection.ASC) {
      sortIndicator = ARROW_UP
    }

    if (sortDirection === SortDirection.DESC) {
      sortIndicator = ARROW_DOWN
    }

    const isSortActive = sortBy == dataKey

    const showSortIndicator = !disabledSort && (isSortActive && sortIndicator)

    return (
      <div
        style={{ flex: `0 1 ${width}` }}
        className={classname('Row__cell', isAction && 'Row__cell--action')}
        onClick={event => onSort(dataKey)}
      >
        <span className={'Row__cell__label'}>{cellRender}</span>
        <span className={'Row__cell__label'}>
          {showSortIndicator && <Icon className="icon link__icon" path={sortIndicator} />}
        </span>
      </div>
    )
  }
)

export default HeaderColumn
