import React, { Component } from 'react'
import { Layout, Flex, Spin, Alert, Pagination, Tabs } from 'antd'
import { Offline, Online } from 'react-detect-offline'
import MoviesService from './services/MoviesService'
import MovieCard from './components/MovieCard'
import SearchInput from './components/SearchInput'
import { GenresProvider } from './components/GenresContext'
import './index.css'

export default class App extends Component {
  movieService = new MoviesService()
  state = {
    search: {
      movies: [],
      page: 1,
      totalResults: 0,
    },
    rated: {
      movies: [],
      page: 1,
      totalResults: 0,
    },
    loading: false,
    error: false,
    searchName: '',
    sessionId: 0,
    activeTab: 'searchTab',
    genres: [],
  }
  onMoviesLoaded = (movies) => {
    this.setState({
      search: { ...this.state.search, movies: movies.results, totalResults: movies.total_results },
      loading: false,
    })
  }

  updateMovies = (name, page) => {
    this.setState({ search: { ...this.state.search, page: page }, loading: true, searchName: name })
    this.movieService.getMovies(name, page).then(this.onMoviesLoaded).catch(this.onError)
  }
  onPageChange = (page) => {
    this.updateMovies(this.state.searchName, page)
  }
  onRatedMoviesLoaded = (movies) => {
    this.setState({
      rated: { ...this.state.rated, movies: movies.results, totalResults: movies.total_results },
      loading: false,
    })
  }

  onRatedPageChange = (page) => {
    this.setState({ rated: { ...this.state.rated, page: page }, loading: true })
    this.getRatedMovies(page).then(this.onRatedMoviesLoaded).catch(this.onError)
  }

  onTabChange = (tab) => {
    const { page } = this.state.rated
    this.setState({ activeTab: tab })
    if (tab === 'ratedTab') {
      this.getRatedMovies(page).then((movies) => this.onRatedMoviesLoaded(movies))
    }
  }
  onError = (err) => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  componentDidMount() {
    if (localStorage.getItem('sessionId')) {
      const id = localStorage.getItem('sessionId')
      this.setState({
        sessionId: id,
      })
    } else {
      this.createGuestSession().then((id) => {
        this.setState({
          sessionId: id,
        })
      })
    }
    this.loadGenres()
  }

  async createGuestSession() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWYzOWU5NTk0NTNhOTNiOTU3ZGRiMTVmOGVjYWZmYSIsInN1YiI6IjY2Njg4MDVmMDZjZmZjYTcwZjhhZmI4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9mpcH370yM4yI3Cu3bcDDvPW1i2kObwvwVFy-Nl40dw',
      },
    }
    const guestSessionRes = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', options)
    if (!guestSessionRes.ok) {
      throw new Error('Could not create guest session')
    }
    const guestSessionResult = await guestSessionRes.json()

    const guestSessionId = guestSessionResult.guest_session_id
    localStorage.setItem('sessionId', guestSessionId)
    return guestSessionId
  }

  getRatedMovies = (page) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }
    return fetch(
      `https://api.themoviedb.org/3/guest_session/${this.state.sessionId}/rated/movies?api_key=61f39e959453a93b957ddb15f8ecaffa&page=${page}`,
      options
    )
      .then((res) => {
        if (res.status === 404) {
          return Promise.reject('No rated movies')
        }
        return res.json()
      })
      .then((res) => {
        if (res.results) {
          return res
        } else return []
      })
      .catch((err) => {
        if (err === 'No rated movies') {
          return []
        } else {
          console.log(err)
          return []
        }
      })
  }

  async getGenres() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWYzOWU5NTk0NTNhOTNiOTU3ZGRiMTVmOGVjYWZmYSIsInN1YiI6IjY2Njg4MDVmMDZjZmZjYTcwZjhhZmI4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9mpcH370yM4yI3Cu3bcDDvPW1i2kObwvwVFy-Nl40dw',
      },
    }

    const genresRes = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    if (!genresRes.ok) {
      throw new Error('Could not get genres')
    }
    const genresResult = await genresRes.json()
    const genresArray = genresResult.genres
    return genresArray
  }

  loadGenres() {
    this.getGenres().then((res) => {
      this.setState({ genres: res })
    })
  }

  render() {
    const { search, rated, loading, error } = this.state
    const { movies } = search
    const items = [
      {
        key: 'searchTab',
        label: 'Search',
        children: (
          <div>
            <SearchInput onMovieSearch={this.updateMovies}></SearchInput>
            <Flex wrap gap='large' justify='space-evenly'>
              {movies.length < 1 && <span>No movies found</span>}

              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} sessionId={this.state.sessionId} />
              ))}
            </Flex>
            {movies.length > 0 && (
              <div className='pagination-wrapper'>
                {' '}
                <Pagination
                  className='pagination'
                  onChange={this.onPageChange}
                  current={search.page}
                  pageSize={20}
                  total={search.totalResults}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'ratedTab',
        label: 'Rated',
        children: (
          <div>
            <Flex wrap gap='large' justify='space-evenly'>
              {rated.movies.length < 1 && <span>No movies rated</span>}

              {rated.movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} sessionId={this.state.sessionId} />
              ))}
            </Flex>
            {rated.movies.length > 0 && (
              <div className='pagination-wrapper'>
                {' '}
                <Pagination
                  className='pagination'
                  onChange={this.onRatedPageChange}
                  current={rated.page}
                  pageSize={20}
                  total={rated.totalResults}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        ),
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
        <GenresProvider value={this.state.genres}>
          <Online>
            <Layout>
              <div className={'wrapper'}>
                <Tabs centered defaultActiveKey={this.state.activeTab} items={items} onChange={this.onTabChange}></Tabs>
              </div>
            </Layout>
          </Online>
          <Offline>
            <Alert message='No connection' description='You are offline' type='warning' showIcon />
          </Offline>
        </GenresProvider>
      </div>
    )
  }
}
