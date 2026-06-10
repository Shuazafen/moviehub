import { Link } from 'react-router-dom';

function Hero({ movie }) {
  const image = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://images.unsplash.com/photo-1517604931442-7c0723b5ebff?auto=format&fit=crop&w=1400&q=80';

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.24),_transparent_35%)]" />
      <div className="absolute inset-0 bg-slate-950/65" />
      <div
        className="relative min-h-[520px] bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="flex h-full items-end px-4 pb-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6 text-slate-100">
            <span className="inline-flex rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-100">
              Featured
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {movie?.title || 'Welcome to MovieHub'}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              {movie?.overview || 'Browse popular movies, save favorites, and stream with SuperEmbed.'}
            </p>
            <div className="flex flex-wrap gap-3">
              {movie && (
                <Link
                  to={`/movie/${movie.id}`}
                  className="inline-flex items-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  ▶ Watch Now
                </Link>
              )}
              <Link
                to="/watchlist"
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
              >
                Watchlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
