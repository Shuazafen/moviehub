import { useEffect, useState } from 'react';
import { fetchJson, authHeaders, getToken } from '../utils/api.js';
import Navbar from '../components/Navbar';

function Watchlist() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) return;

    fetchJson('/api/watchlist', {
      headers: authHeaders(),
    })
      .then(setItems)
      .catch((err) => setError(err.message));
  }, []);

  const handleRemove = async (tmdbId) => {
    try {
      await fetchJson(`/api/watchlist/${tmdbId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      setItems((current) => current.filter((item) => item.tmdbId !== tmdbId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <section className="rounded-[32px] bg-slate-900/85 p-8 shadow-glow ring-1 ring-white/10 backdrop-blur-xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Your Watchlist</h1>
              <p className="mt-2 text-sm text-slate-400">Saved movies will appear here as you add them from the homepage.</p>
            </div>
          </div>

          {!getToken() ? (
            <p className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-500/20">
              Please sign in to view your watchlist.
            </p>
          ) : error ? (
            <p className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-500/20">
              {error}
            </p>
          ) : items.length === 0 ? (
            <p className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300 ring-1 ring-slate-700">
              No items yet. Add movies from the home page.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <article key={item.tmdbId} className="overflow-hidden rounded-[32px] bg-slate-900/80 shadow-glow ring-1 ring-white/5 transition hover:-translate-y-1 hover:shadow-2xl">
                  <img
                    src={item.posterPath ? `https://image.tmdb.org/t/p/w342${item.posterPath}` : '/placeholder.png'}
                    alt={item.title}
                    className="h-[280px] w-full object-cover"
                  />
                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{item.releaseDate}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.tmdbId)}
                      className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Watchlist;
