import React from 'react'
import { Card, Flex, Typography } from 'antd'
import './MovieCard.css'
import { format } from 'date-fns'
import Rating from './Rating'
import { GenresConsumer } from './GenresContext'

export default function MovieCard({ movie, sessionId }) {
  const posterurl = 'https://image.tmdb.org/t/p/w185'

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text
    }
    const truncated = text.substr(0, maxLength)
    return truncated.substr(0, truncated.lastIndexOf(' ')) + '...'
  }
  function formatDate(dateString) {
    if (!dateString) {
      return 'Unknown release date'
    }
    return format(dateString, 'MMMM d, yyyy')
  }
  function chooseBorderColor(rating) {
    if (rating > 7) {
      return 'green'
    }
    if (rating > 5) {
      return 'yellow'
    }
    if (rating > 3) {
      return 'orange'
    }
    return 'red'
  }

  return (
    <Card
      hoverable
      className='card'
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <Flex align='flex-start' className='card-container'>
        <div className='pic-container'>
          <img alt='poster' src={`${posterurl}${movie.poster_path}`} className='poster' />
        </div>
        <Flex vertical className='description-container'>
          <Flex className='card_body' vertical align='flex-start'>
            <Typography.Title className='card-title' level={5} style={{ marginBottom: 0 }}>
              {movie.title}
            </Typography.Title>
            <div className={`rating-circle ${chooseBorderColor(movie.vote_average)}`}>
              {movie.vote_average.toFixed(1)}
            </div>
            <Typography.Text>{formatDate(movie.release_date)} </Typography.Text>
            <GenresConsumer>
              {(value) => (
                <div className='genres-container'>
                  {movie.genre_ids.map((genreId) => {
                    return value.map((genre) => {
                      if (genre.id === genreId) {
                        return (
                          <Typography.Text key={genreId} code={true}>
                            {genre.name}
                          </Typography.Text>
                        )
                      } else return null
                    })
                  })}
                </div>
              )}
            </GenresConsumer>

            <Typography.Text>{truncateText(movie.overview, 110)}</Typography.Text>
          </Flex>
          <Rating sessionId={sessionId} movieId={movie.id} />
        </Flex>
      </Flex>
    </Card>
  )
}
