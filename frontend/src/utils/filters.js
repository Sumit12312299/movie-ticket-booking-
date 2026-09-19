/**
 * Client-side search and filtering helpers for movies and theatres.
 */

export const filterMoviesBySearch = (movies = [], query = '') => {
  if (!query.trim()) return movies;
  const q = query.toLowerCase().trim();
  return movies.filter(
    (movie) =>
      movie.title?.toLowerCase().includes(q) ||
      movie.genre?.some((g) => g.toLowerCase().includes(q)) ||
      movie.language?.toLowerCase().includes(q)
  );
};

export const filterMoviesByGenre = (movies = [], genre = 'all') => {
  if (!genre || genre.toLowerCase() === 'all') return movies;
  const g = genre.toLowerCase();
  return movies.filter((movie) =>
    Array.isArray(movie.genre)
      ? movie.genre.some((item) => item.toLowerCase() === g)
      : movie.genre?.toLowerCase() === g
  );
};

export const sortMovies = (movies = [], sortBy = 'rating') => {
  const sorted = [...movies];
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'title':
      return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'releaseDate':
      return sorted.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
    default:
      return sorted;
  }
};
