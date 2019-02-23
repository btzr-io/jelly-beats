import React from 'react'
import Button from '@/components/button'
import {
  Table,
  Column,
  AutoSizer,
  WindowScroller,
  SortDirection,
  SortIndicator,
} from 'react-virtualized'
import 'react-virtualized/styles.css'

class DataTable extends React.PureComponent {
  static defaultRowHeight = 50

  static sortObjectArray = (items, dataKey) => {
    items.sort(function(a, b) {
      if (a[dataKey] > b[dataKey]) {
        return 1
      }
      if (a[dataKey] < b[dataKey]) {
        return -1
      }
      // Equal value
      return 0
    })
  }

  constructor(props) {
    super(props)

    const { list } = this.props

    this.state = {
      sortBy: null,
      sortedList: list,
      sortDirection: null,
    }
  }

  static defaultHeaderRenderer({ label, dataKey, sortBy, sortDirection }) {
    return (
      <div>
        {label}
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    )
  }

  static defaultCellRenderer({ dataKey, cellData, rowIndex, isScrolling }) {
    if (isScrolling) {
      // return <span className={'table__row__cell--placeholder'} />
    }

    if (React.isValidElement(cellData)) {
      return cellData()
    }

    if (dataKey === 'index') {
      return <span className={'table__row__cell--text'}>{rowIndex + 1}</span>
    }

    if (typeof cellData === 'string' || typeof cellData === 'number') {
      return <span className={'table__row__cell--text'}>{cellData}</span>
    }

    return cellData ? String(cellData) : ''
  }

  defaultRowGetter = ({ index }) => {
    const { sortedList } = this.state
    return sortedList[index]
  }

  sortData = ({ sortBy, sortDirection }) => {
    const { list } = this.props
    const tempList = DataTable.sortObjectArray(list, sortBy)
    const sortedList = sortDirection === SortDirection.DESC ? list.reverse() : list
    this.setState({ sortBy, sortDirection, sortedList })
  }

  render() {
    // Table data as an array of objects
    const { columns } = this.props
    const { sortedList, sortBy, sortDirection } = this.state

    const tableRenderer = ({ width, height }) => (
      <Table
        // autoHeight
        width={width}
        height={height}
        headerHeight={DataTable.defaultRowHeight}
        rowHeight={DataTable.defaultRowHeight}
        rowCount={sortedList.length}
        rowGetter={this.defaultRowGetter}
        // Sortable data
        sort={this.sortData}
        sortBy={sortBy}
        sortDirection={sortDirection}
      >
        {columns.map(columnProps => (
          <Column
            key={columnProps.dataKey}
            cellRenderer={DataTable.defaultCellRenderer}
            headerRenderer={DataTable.defaultHeaderRenderer}
            {...columnProps}
          />
        ))}
      </Table>
    )

    return <AutoSizer heightDisabled={false}>{tableRenderer}</AutoSizer>
  }
}

export default DataTable
