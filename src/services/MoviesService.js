export default class MoviesService {
  async getMovies(name, page) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWYzOWU5NTk0NTNhOTNiOTU3ZGRiMTVmOGVjYWZmYSIsInN1YiI6IjY2Njg4MDVmMDZjZmZjYTcwZjhhZmI4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9mpcH370yM4yI3Cu3bcDDvPW1i2kObwvwVFy-Nl40dw',
      },
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=${page}`,
      options
    )
    if (!res.ok) {
      throw new Error('Could not fetch')
    }
    const result = await res.json()
    return result
  }
}
