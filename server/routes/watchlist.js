import express from 'express';
import WatchlistItem from '../models/WatchlistItem.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const items = await WatchlistItem.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', async (req, res) => {
  try {
    console.log('Watchlist payload:', req.body);
    const { tmdbId, title, posterPath, releaseDate, overview } = req.body;
    const movieObj = req.body.movie || {};

    const effectiveTitle = title || movieObj.title || movieObj.name || movieObj.original_title || req.body.name || req.body.original_title;
    const effectiveId = tmdbId || movieObj.id || movieObj.tmdbId || movieObj.movieId || req.body.id || req.body.movieId;
    const effectivePoster = posterPath || movieObj.poster_path || movieObj.posterPath;
    const effectiveRelease = releaseDate || movieObj.release_date || movieObj.first_air_date;
    const effectiveOverview = overview || movieObj.overview || movieObj.description;

    if (!effectiveId || !effectiveTitle) {
      return res.status(400).json({ message: 'Movie ID and title are required' });
    }

    const item = await WatchlistItem.create({
      user: req.user.id,
      tmdbId: effectiveId.toString(),
      title: effectiveTitle,
      posterPath: effectivePoster,
      releaseDate: effectiveRelease,
      overview: effectiveOverview,
    });

    res.status(201).json(item);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Movie already in watchlist' });
    }
    console.error('Watchlist add error:', error);
    res.status(500).json({ message: 'Could not add to watchlist' });
  }
});

router.delete('/:tmdbId', async (req, res) => {
  const item = await WatchlistItem.findOneAndDelete({
    user: req.user.id,
    tmdbId: req.params.tmdbId,
  });

  if (!item) {
    return res.status(404).json({ message: 'Watchlist item not found' });
  }

  res.json({ message: 'Removed from watchlist' });
});

export default router;
