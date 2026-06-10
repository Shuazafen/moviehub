import { Link, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/api.js';

function Navbar() {
  const token = getToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-semibold tracking-tight text-white">
          MovieHub
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/" className="text-sm font-medium text-slate-300 transition hover:text-white">
            Home
          </Link>
          <Link to="/watchlist" className="text-sm font-medium text-slate-300 transition hover:text-white">
            Watchlist
          </Link>
          {token ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-medium text-white transition hover:border-slate-500 hover:bg-slate-800"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;