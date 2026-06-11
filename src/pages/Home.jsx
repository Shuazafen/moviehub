import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieCard from "../components/MovieCard";
import ToastContainer from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { authHeaders, fetchJson, getToken } from "../utils/api.js";

function Home() {
  const [movies, setMovies] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [searchSource, setSearchSource] = useState('popular');
  const [searching, setSearching] = useState(false);
  // Set of TMDB IDs (strings) the user has added this session
  const [addedIds, setAddedIds] = useState(() => new Set());

  const { toasts, addToast, dismissToast } = useToast();

  const loadPopular = async () => {
    try {
      const data = await fetchJson('/api/movies/popular');
      const results = data.results || [];
      setMovies(results);
      setFeatured(results[0] || null);
      setSearchSource('popular');
      setStatus('');
    } catch (err) {
      setStatus(err.message);
    }
  };

  useEffect(() => {
    loadPopular();
  }, []);

  const addToWatchlist = async (movie) => {
    if (!getToken()) {
      window.location.href = '/login';
      return;
    }

    const movieId = movie.id?.toString();

    // Optimistically mark as added immediately
    setAddedIds((prev) => new Set([...prev, movieId]));

    try {
      const title = movie.title || movie.original_title || movie.name || 'Untitled';
      await fetchJson('/api/watchlist', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          tmdbId: movieId,
          title,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date || movie.first_air_date || '',
          overview: movie.overview || movie.description || '',
          movie,
        }),
      });
      addToast(`"${title}" added to your watchlist!`, 'success');
    } catch (err) {
      // Revert if it actually failed
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(movieId);
        return next;
      });
      addToast(err.message, 'error');
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      loadPopular();
      return;
    }

    setSearching(true);
    setStatus('Searching movies...');

    try {
      const data = await fetchJson(`/api/movies/search?q=${encodeURIComponent(trimmed)}`);
      setMovies(data.results || []);
      setFeatured(data.results?.[0] || null);
      setSearchSource(data.source || 'search');
      setStatus(data.results?.length ? '' : 'No results found.');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero movie={featured} />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              {searchSource === 'popular' ? 'Trending' : 'Search results'}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {searchSource === 'popular'
                ? 'Popular movies powered by TMDB'
                : `Search results for "${query.trim()}"`}
            </h2>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="movie-search">
              Search movies
            </label>
            <input
              id="movie-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 shadow-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 sm:w-80"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={searching}
            >
              {searching ? 'Searching…' : 'Search'}
            </button>
          </form>
        </div>

        {status && (
          <div className="mb-6 rounded-3xl bg-slate-900/80 px-5 py-3 text-sm text-slate-200 ring-1 ring-slate-700">
            {status}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {movies.slice(0, 12).map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              added={addedIds.has(movie.id?.toString())}
              onAdd={() => addToWatchlist(movie)}
            />
          ))}
        </div>
      </main>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default Home;