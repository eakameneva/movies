import React, { Component } from 'react'
import { Input } from 'antd'
import { debounce } from 'lodash'
import './SearchInput.css'

export default class SearchInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
    }
    this.onLabelChange = this.onLabelChange.bind(this)
    this.debouncedSubmit = debounce(this.onSubmit.bind(this), 2000)
  }

  onLabelChange(event) {
    this.setState({
      searchText: event.target.value,
    })
    this.debouncedSubmit(event.target.value)
  }

  onSubmit(searchText) {
    const trimmedLabel = searchText.trim()
    if (trimmedLabel === '') {
      return
    }
    const { onMovieSearch } = this.props
    onMovieSearch(trimmedLabel, 1)
  }

  render() {
    const { searchText } = this.state
    return (
      <Input
        onChange={this.onLabelChange}
        value={searchText}
        name='input-form'
        autoFocus
        className='search-input'
        placeholder='Type to search...'
        size='middle'
        autoсomplete='off'
      />
    )
  }
}
