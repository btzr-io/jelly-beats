import React from 'react'
import Icon from '@mdi/react'
import classnames from 'classnames'

import Button from '@/components/button'
import { SEARCH as iconSearch, CLOSE as iconClose } from '@/constants/icons'

class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      focus: false,
      value: '',
    }
  }

  handleFocus = () => {
    this.setState({ focus: true })
  }

  handleBlur = () => {
    this.setState({ focus: false })
  }

  handleChange = event => {
    this.setState({ value: event.target.value })
  }

  handleSearch = () => {
    const { value } = this.state
    const { doNavigate, updateSearchQuery } = this.props
    if (value.length > 0) {
      updateSearchQuery(value)
      doNavigate('/search')
    }
  }

  handleQuitSearch = event => {
    const { navigation, doNavigateBackward } = this.props
    const { currentPage } = navigation
    // Clear input
    this.setState({ value: '' })
    // Return to last page
    if (currentPage === '/search') {
      doNavigateBackward()
    }
  }

  handleSubmit = event => {
    event.preventDefault()
    this.handleSearch()
  }

  render() {
    const { focus, value } = this.state

    return (
      <form
        role="search"
        onSubmit={this.handleSubmit}
        className={classnames('search-bar', { 'search-bar--focus': focus })}
      >
        <Button
          type={'search'}
          size={'normal'}
          icon={iconSearch}
          onClick={this.handleSearch}
        />
        <label htmlFor="header-search">
          <span className="search-bar--label">Search</span>
        </label>
        <input
          id="header-search"
          type="text"
          value={value}
          placeholder="Search"
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
        />
        {value && value.length > 0 ? (
          <Button
            type={'search'}
            size={'normal'}
            icon={iconClose}
            onClick={this.handleQuitSearch}
          />
        ) : null}
      </form>
    )
  }
}

export default SearchBar
