import React from 'react'
import { Card, Flex, Typography, Rate } from 'antd'
import './MovieCard.css'
import { format } from 'date-fns'

export default function MovieCard({ movie }) {
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
      <Flex align='flex-start'>
        <div className='pic-container'>
          <img alt='poster' src={`${posterurl}${movie.poster_path}`} className='poster' />
        </div>

        <Flex
          vertical
          align='flex-start'
          style={{
            padding: 20,
          }}
        >
          <Typography.Title className='card-title' level={5}>
            {movie.title}
          </Typography.Title>
          <div className='rating-circle'>6.6</div>
          <Typography.Text>{formatDate(movie.release_date)} </Typography.Text>
          <div>
            <Typography.Text code={true}>Action</Typography.Text>
            <Typography.Text code={true}>Drama</Typography.Text>
          </div>
          <Typography.Text>{truncateText(movie.overview, 150)}</Typography.Text>
          <Rate count={10}></Rate>
        </Flex>
      </Flex>
    </Card>
  )
}
