import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchJson, saveToken } from '../utils/api.js';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const data = await fetchJson('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      saveToken(data.token);
      toast.success('Account created successfully');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[32px] bg-slate-900/90 p-8 shadow-glow ring-1 ring-white/10 backdrop-blur-xl">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold">Create account</h1>
          <p className="text-sm text-slate-400">Register to save watchlist items and open details.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-slate-200">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none ring-1 ring-slate-700 transition focus:border-indigo-400 focus:ring-indigo-400/20"
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none ring-1 ring-slate-700 transition focus:border-indigo-400 focus:ring-indigo-400/20"
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none ring-1 ring-slate-700 transition focus:border-indigo-400 focus:ring-indigo-400/20"
            />
          </label>

          {error && <p className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-500/20">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-indigo-300 transition hover:text-indigo-100">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
