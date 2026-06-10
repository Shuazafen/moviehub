import mongoose from 'mongoose';

const watchlistItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tmdbId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    posterPath: String,
    releaseDate: String,
    overview: String,
  },
  { timestamps: true }
);

watchlistItemSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

export default mongoose.model('WatchlistItem', watchlistItemSchema);
