export default class MoviesService {
  static options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWYzOWU5NTk0NTNhOTNiOTU3ZGRiMTVmOGVjYWZmYSIsInN1YiI6IjY2Njg4MDVmMDZjZmZjYTcwZjhhZmI4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9mpcH370yM4yI3Cu3bcDDvPW1i2kObwvwVFy-Nl40dw',
    },
  }

  static baseUrl = 'https://api.themoviedb.org/3/'

  static async getMovies(name, page) {
    const res = await fetch(
      `${MoviesService.baseUrl}search/movie?query=${name}&include_adult=false&language=en-US&page=${page}`,
      MoviesService.options
    )
    if (!res.ok) {
      throw new Error('Could not fetch')
    }
    const result = await res.json()
    return result
  }

  static async createGuestSession() {
    const guestSessionRes = await fetch(
      `${MoviesService.baseUrl}authentication/guest_session/new`,
      MoviesService.options
    )
    if (!guestSessionRes.ok) {
      throw new Error('Could not create guest session')
    }
    const guestSessionResult = await guestSessionRes.json()

    const guestSessionId = guestSessionResult.guest_session_id

    return guestSessionId
  }

  static async getGenres() {
    const genresRes = await fetch(`${MoviesService.baseUrl}genre/movie/list?language=en`, MoviesService.options)
    if (!genresRes.ok) {
      throw new Error('Could not get genres')
    }
    const genresResult = await genresRes.json()
    return genresResult.genres
  }

  static async getRatedMovies(page, sessionId) {
    const ratedMoviesRes = await fetch(
      `${MoviesService.baseUrl}guest_session/${sessionId}/rated/movies?api_key=61f39e959453a93b957ddb15f8ecaffa&page=${page}`,
      MoviesService.options
    )
    if (ratedMoviesRes.status === 404) {
      return []
    }
    if (!ratedMoviesRes.ok) {
      throw new Error('Could not get rated movies')
    }
    const ratedMoviesResult = await ratedMoviesRes.json()
    if (ratedMoviesResult.results) {
      return ratedMoviesResult
    }

    return []
  }
}
