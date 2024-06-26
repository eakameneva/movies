import React, { Component } from 'react'
import { Layout, Flex, Spin, Alert, Pagination, Tabs } from 'antd'
import { Offline, Online } from 'react-detect-offline'
import MoviesService from './services/MoviesService'
import MovieCard from './components/MovieCard'
import SearchInput from './components/SearchInput'
import './index.css'

export default class App extends Component {
  movieService = new MoviesService()
  state = {
    movies: [],
    loading: false,
    error: false,
    page: null,
    searchName: '',
    totalResults: 0,
  }
  onMoviesLoaded = (movies) => {
    this.setState({ movies: movies.results, loading: false, totalResults: movies.total_results })
  }
  onError = (err) => {
    this.setState({
      error: true,
      loading: false,
    })
  }
  updateMovies = (name, page) => {
    this.setState({ loading: true, searchName: name, page: page })
    this.movieService.getMovies(name, page).then(this.onMoviesLoaded).catch(this.onError)
  }
  onPageChange = (page) => {
    this.updateMovies(this.state.searchName, page)
  }

  render() {
    const { movies, loading, error, page, totalResults } = this.state
    const items = [
      {
        key: '1',
        label: 'Search',
        children: 'Content of Tab Pane 1',
      },
      {
        key: '2',
        label: 'Rated',
        children: 'Content of Tab Pane 2',
      },
    ]
    if (error) return <Alert message='Error' description='Failed to load movies' type='error' showIcon />
    if (loading)
      return (
        <div className='spinner-container'>
          <Spin className='spinner' />
        </div>
      )

    return (
      <div>
        <Online>
          <Layout>
            <div className={'wrapper'}>
              <Flex wrap gap='large' justify='space-evenly'>
                <Tabs defaultActiveKey='1' items={items}></Tabs>
                <SearchInput onMovieSearch={this.updateMovies}></SearchInput>
                {movies.length < 1 && <span>No movies found</span>}

                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </Flex>
              {movies.length > 0 && (
                <div className='pagination-wrapper'>
                  {' '}
                  <Pagination
                    className='pagination'
                    onChange={this.onPageChange}
                    defaultCurrent={1}
                    current={page}
                    pageSize={20}
                    total={totalResults}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </div>
          </Layout>
        </Online>
        <Offline>
          <Alert message='No connection' description='You are offline' type='warning' showIcon />
        </Offline>
      </div>
    )
  }
}
