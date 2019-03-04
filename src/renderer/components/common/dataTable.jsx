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
  static defaultProps = {
    list: [],
    filters: [],
    sortBy: null,
    sortDirection: null,
    rowClassName: DataTable.defaultRowClassName,
  }

  constructor(props) {
    super(props)

    const { list } = this.props

    this.state = {
      sortBy: null,
      sortedList: list,
      sortDirection: null,
      loadedRowsMap: {},
      loadedRowCount: 0,
      loadedRowCount: 0,
    }

    this.tableRef = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentIndex !== this.props.currentIndex) {
      this.tableRef.current.scrollToRow(this.props.currentIndex)
    }
  }

  static defaultRowHeight = 52

  static sortObjectArray = (items, dataKey) =>
    items.sort((a, b) => {
      if (a[dataKey] > b[dataKey]) {
        return 1
      }
      if (a[dataKey] < b[dataKey]) {
        return -1
      }
      // Equal value
      return 0
    })

  static defaultHeaderRenderer = ({ label, dataKey, sortBy, sortDirection }) => (
    <div>
      {label}
      {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
    </div>
  )

  static defaultRowClassName = ({ index }) => {
    return 'table__row'
  }

  static defaultCellDataGetter({ dataKey, rowData }) {
    if (!rowData) return null

    if (typeof rowData.get === 'function') {
      rowData.get(dataKey)
    }

    return rowData[dataKey]
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
    return this.props.list[index]
  }

  render() {
    // Table data as an array of objects
    const {
      list,
      filters,
      columns,
      rowCount,
      rowClassName,
      currentIndex,
      sortBy,
      onSort,
      sortDirection,
    } = this.props

    const tableRenderer = (
      <AutoSizer>
        {({ width, height }) => (
          <Table
            ref={this.tableRef}
            // autoHeight
            height={height}
            width={width}
            headerHeight={DataTable.defaultRowHeight}
            rowHeight={DataTable.defaultRowHeight}
            rowCount={rowCount}
            rowGetter={this.defaultRowGetter}
            rowClassName={rowClassName}
            // onRowsRendered={onRowsRendered}
            // Sortable data
            sort={onSort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            overscanRowCount={10}
            scrollToIndex={currentIndex}
          >
            {columns.map(columnProps => {
              if (filters.length > 0) {
                if (filters.indexOf(columnProps.dataKey) !== -1) {
                  return null
                }
              }
              return (
                <Column
                  key={columnProps.dataKey}
                  cellRenderer={DataTable.defaultCellRenderer}
                  cellDataGetter={DataTable.defaultCellDataGetter}
                  headerRenderer={DataTable.defaultHeaderRenderer}
                  headerClassName={'table__row__column'}
                  className={'table__row__column'}
                  {...columnProps}
                />
              )
            })}
          </Table>
        )}
      </AutoSizer>
    )

    return tableRenderer
  }
}

export default DataTable
