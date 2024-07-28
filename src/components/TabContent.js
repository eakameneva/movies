import React from 'react'
import { Flex, Pagination } from 'antd'

import MovieCard from './MovieCard'

export default function TabContent({ sessionId, moviesData, onPageChange, children }) {
  const { movies, page, totalResults } = moviesData
  return (
    <div>
      <Flex wrap gap='large' justify='space-evenly' className='cards-list'>
        {children}
        {movies.length < 1 && <span>No movies</span>}

        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} sessionId={sessionId} />
        ))}
      </Flex>
      {movies.length > 0 && (
        <div className='pagination-wrapper'>
          {' '}
          <Pagination
            className='pagination'
            onChange={onPageChange}
            current={page}
            pageSize={20}
            total={totalResults}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  )
}
