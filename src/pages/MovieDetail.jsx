import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setError(data.message);
        } else {
          setMovie(data);
        }
      })
      .catch(() => setError('Unable to load movie details.'));
  }, [id]);

  const baseEmbedUrl = import.meta.env.VITE_SUPEREMBED_BASE_URL;
  const embedUrl = baseEmbedUrl
    ? `${baseEmbedUrl}${encodeURIComponent(id)}&tmdb=1`
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <Link to="/" className="mb-6 inline-flex text-sm font-medium text-cyan-300 transition hover:text-cyan-100">
          ← Back to home
        </Link>

        {error && (
          <p className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-500/20">
            {error}
          </p>
        )}

        {movie ? (
          <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="overflow-hidden rounded-[32px] bg-slate-900/85 shadow-glow ring-1 ring-white/10">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-8 rounded-[32px] bg-slate-900/85 p-8 shadow-glow ring-1 ring-white/10 backdrop-blur-xl">
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold text-white">{movie.title}</h1>
                <p className="text-sm text-slate-400">
                  {movie.release_date} · {movie.runtime} min · {movie.genres?.map((genre) => genre.name).join(', ')}
                </p>
                <p className="text-slate-300">{movie.overview}</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-400">
                  Watch with SuperEmbed
                </p>
                {embedUrl ? (
                  <div className="overflow-hidden rounded-3xl bg-slate-950/90 ring-1 ring-slate-800">
                    <iframe
                      title="SuperEmbed player"
                      src={embedUrl}
                      allowFullScreen
                      loading="lazy"
                      className="h-[360px] w-full border-0"
                    />
                  </div>
                ) : (
                  <div className="rounded-3xl bg-slate-900/80 px-5 py-6 text-sm text-slate-300 ring-1 ring-slate-700">
                    <p className="font-medium text-white">SuperEmbed is not configured.</p>
                    <p className="mt-2 text-slate-400">
                      Add `VITE_SUPEREMBED_BASE_URL` to your `.env` file to enable the player.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : (
          !error && <p className="text-slate-300">Loading movie details…</p>
        )}
      </main>
    </div>
  );
}

export default MovieDetail;
