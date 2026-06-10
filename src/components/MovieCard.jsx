import { Link } from 'react-router-dom';

function MovieCard({ movie, onAdd }) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : '/placeholder.png';

  return (
    <article className="group overflow-hidden rounded-[32px] bg-slate-900/85 shadow-glow transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <Link to={`/movie/${movie.id}`} className="block overflow-hidden">
        <img
          src={poster}
          alt={movie.title}
          className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="space-y-5 p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
          <p className="mt-2 text-sm text-slate-400">{movie.release_date}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              onAdd?.();
            }}
            className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
          >
            + Watchlist
          </button>
          <Link
            to={`/movie/${movie.id}`}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
