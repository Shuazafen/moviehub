# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Backend and API Integration

This project now includes a Node.js backend in the `server/` folder with:

- Express API routes for authentication and watchlist management
- MongoDB integration via Mongoose
- TMDB proxy routes for movie metadata
- JWT-based user authentication

Create a `.env` file from `.env.example` and set `MONGODB_URI`, `JWT_SECRET`, and `TMDB_API_KEY` before starting the backend.

For SuperEmbed playback, also set `VITE_SUPEREMBED_BASE_URL` and `VITE_SUPEREMBED_TOKEN` if your embed provider requires a token.

The backend now supports a search API at `GET /api/movies/search?q=your+query`, returning up to 15 cached search results.

Run both the frontend and backend together with:

```bash
npm install
npm run dev
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
