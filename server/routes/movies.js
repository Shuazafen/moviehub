import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const TMDB_BASE = 'https://api.themoviedb.org/3';
const SEARCH_CACHE = new Map();
const SEARCH_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const SEARCH_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const SEARCH_RATE_LIMIT_COUNT = 5;
const SEARCH_RESULTS_LIMIT = 15;
const searchRateMap = new Map();

function buildUrl(path, query = '') {
  if (!query) {
    return `${TMDB_BASE}${path}`;
  }

  return `${TMDB_BASE}${path}${query.startsWith('?') ? query : `?${query.startsWith('&') ? query.slice(1) : query}`}`;
}

function getClientIdentifier(req) {
  return req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
}

function isRateLimited(key) {
  const now = Date.now();
  const timestamps = searchRateMap.get(key) || [];
  const recent = timestamps.filter((ts) => now - ts < SEARCH_RATE_LIMIT_WINDOW);

  if (recent.length >= SEARCH_RATE_LIMIT_COUNT) {
    searchRateMap.set(key, recent);
    return true;
  }

  recent.push(now);
  searchRateMap.set(key, recent);
  return false;
}

function getCachedSearch(query) {
  const cacheKey = query.toLowerCase().trim();
  const cached = SEARCH_CACHE.get(cacheKey);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > SEARCH_CACHE_TTL) {
    SEARCH_CACHE.delete(cacheKey);
    return null;
  }
  return cached.data;
}

function setCachedSearch(query, data) {
  const cacheKey = query.toLowerCase().trim();
  SEARCH_CACHE.set(cacheKey, { data, timestamp: Date.now() });
}

async function proxyTmdb(path, query = '') {
  const apiKey = process.env.TMDB_API_KEY;
  const token = process.env.TMDB_TOKEN;

  if (!apiKey && !token) {
    throw new Error('TMDB_API_KEY is not configured');
  }

  const url = apiKey
    ? `${TMDB_BASE}${path}?api_key=${apiKey}${query}`
    : buildUrl(path, query);

  const headers = token && !apiKey ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`TMDB service error: ${response.status} ${response.statusText} - ${message}`);
  }

  return response.json();
}

router.get('/popular', async (req, res) => {
  try {
    const page = req.query.page ? `&page=${req.query.page}` : '';
    const data = await proxyTmdb('/movie/popular', page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) {
      return res.status(400).json({ message: 'Search query is required.' });
    }

    const clientKey = getClientIdentifier(req);
    if (isRateLimited(clientKey)) {
      return res.status(429).json({ message: 'Too many search requests. Please wait a moment and try again.' });
    }

    const cached = getCachedSearch(query);
    if (cached) {
      return res.json({ results: cached, source: 'cache' });
    }

    const data = await proxyTmdb('/search/movie', `&query=${encodeURIComponent(query)}&page=1`);
    const results = Array.isArray(data.results) ? data.results.slice(0, SEARCH_RESULTS_LIMIT) : [];
    setCachedSearch(query, results);
    res.json({ results, source: 'tmdb' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await proxyTmdb(`/movie/${req.params.id}`, '&append_to_response=videos,credits');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
