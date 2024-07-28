import React, { Component } from 'react'
import { Layout, Spin, Alert, Tabs } from 'antd'
import { Offline, Online } from 'react-detect-offline'

import MoviesService from './services/MoviesService'
import SearchInput from './components/SearchInput'
import { GenresProvider } from './components/GenresContext'
import './index.css'
import TabContent from './components/TabContent'

const initialTabState = {
  movies: [],
  page: 1,
  totalResults: 0,
}
export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: initialTabState,
      rated: initialTabState,
      loading: false,
      error: false,
      searchName: '',
      sessionId: 0,
      activeTab: 'searchTab',
      genres: [],
    }
  }

  componentDidMount() {
    if (localStorage.getItem('sessionId')) {
      const id = localStorage.getItem('sessionId')
      this.setState({
        sessionId: id,
      })
    } else {
      MoviesService.createGuestSession().then((id) => {
        localStorage.setItem('sessionId', id)
        this.setState({
          sessionId: id,
        })
      })
    }
    this.loadGenres()
  }

  onMoviesLoaded = (movies) => {
    this.setState((prevState) => ({
      search: { ...prevState.search, movies: movies.results, totalResults: movies.total_results },
      loading: false,
    }))
  }

  onPageChange = (page) => {
    const { searchName } = this.state
    this.updateMovies(searchName, page)
  }

  onRatedMoviesLoaded = (movies) => {
    this.setState((prevState) => ({
      rated: { ...prevState.rated, movies: movies.results, totalResults: movies.total_results },
      loading: false,
    }))
  }

  onRatedPageChange = (page) => {
    const { sessionId } = this.state
    this.setState((prevState) => ({
      rated: { ...prevState.rated, page },
      loading: true,
    }))
    MoviesService.getRatedMovies(page, sessionId).then(this.onRatedMoviesLoaded).catch(this.onError)
  }

  onTabChange = (tab) => {
    const { rated, sessionId } = this.state
    const { page } = rated
    this.setState({ activeTab: tab })
    if (tab === 'ratedTab') {
      MoviesService.getRatedMovies(page, sessionId).then((movies) => this.onRatedMoviesLoaded(movies))
    }
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  updateMovies = (name, page) => {
    this.setState((prevState) => ({
      search: { ...prevState.search, page },
      loading: true,
      searchName: name,
    }))
    MoviesService.getMovies(name, page).then(this.onMoviesLoaded).catch(this.onError)
  }

  loadGenres() {
    MoviesService.getGenres()
      .then((res) => {
        this.setState({ genres: res })
      })
      .catch(this.onError)
  }

  render() {
    const { search, rated, loading, error, activeTab, genres, sessionId } = this.state

    const items = [
      {
        key: 'searchTab',
        label: 'Search',
        children: (
          <TabContent moviesData={search} onPageChange={this.onPageChange} sessionId={sessionId}>
            {' '}
            <SearchInput onMovieSearch={this.updateMovies} />{' '}
          </TabContent>
        ),
      },
      {
        key: 'ratedTab',
        label: 'Rated',
        children: <TabContent moviesData={rated} onPageChange={this.onRatedPageChange} sessionId={sessionId} />,
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
        <GenresProvider value={genres}>
          <Online>
            <Layout>
              <div className='wrapper'>
                <Tabs centered defaultActiveKey={activeTab} items={items} onChange={this.onTabChange} />
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
