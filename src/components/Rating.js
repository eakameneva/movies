import React, { Component } from 'react'
import { Rate } from 'antd'

export default class Rating extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rating: 0,
      hasRated: false,
    }
  }

  addRating = (value) => {
    const { movieId, sessionId } = this.props

    this.setState({ rating: value, hasRated: true })
    localStorage.setItem(movieId, value)
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value }),
    }

    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=61f39e959453a93b957ddb15f8ecaffa&guest_session_id=${sessionId}`,
      options
    )
      .then((response) => response.json())
      .then((response) => response)
      .catch((error) => {
        throw new Error('Could not add rating', error)
      })
  }

  getCurrentRating = () => {
    const { movieId } = this.props
    const { rating, hasRated } = this.state
    if (Object.prototype.hasOwnProperty.call(localStorage, movieId)) {
      return +localStorage.getItem(movieId)
    }
    if (hasRated) {
      return rating
    }
    return 0
  }

  render() {
    return (
      <div>
        <Rate
          className='rating_container'
          allowHalf
          count={10}
          value={this.getCurrentRating()}
          onChange={this.addRating}
        />
      </div>
    )
  }
}
