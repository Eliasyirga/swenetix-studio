# 🎵 Swenetix Studio - Full-Stack Song Management Application
### Addis Software MERN Stack Technical Assessment

A production-ready, strictly typed Full-Stack Song Management Application built with TypeScript across the entire stack, featuring MongoDB `$facet` aggregation pipelines, Redux Toolkit, Redux-Saga with reactive updates, and Emotion + Styled-System design.

![Tech Stack](https://img.shields.io/badge/Stack-MERN%20%7C%20TypeScript%20%7C%20Redux--Saga%20%7C%20Emotion-6366f1)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Zero%20Any-blue)
![Docker](https://img.shields.io/badge/Docker-Multi--Stage%20Compose-2496ED)

---

## 📋 Table of Contents
1. [Core Features & Requirements Matrix](#-core-features--requirements-matrix)
2. [Architecture & Technical Breakdown](#-architecture--technical-breakdown)
3. [Concepts, Logic & Reasoning](#-concepts-logic--reasoning-deep-dive)
4. [Project Structure](#-project-structure)
5. [Quick Start & Local Development](#-quick-start--local-development)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [MongoDB Aggregation Pipeline ($facet)](#-mongodb-aggregation-pipeline-facet)
8. [Frontend State & Redux-Saga Reactive Flow](#-frontend-state--redux-saga-reactive-flow)
9. [Bonus: Deployment Guide (Render, Vercel, Netlify)](#-bonus-deployment-guide)

---

## 🌟 Core Features & Requirements Matrix

| Assessment Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Song Model** | Schema with `title`, `artist`, `album`, `genre`, `duration`, `timestamps`, compound text indexes | ✅ Complete |
| **CRUD REST API** | `POST /api/songs`, `GET /api/songs`, `PUT /api/songs/:id`, `DELETE /api/songs/:id` | ✅ Complete |
| **Statistical Aggregations** | MongoDB `$facet` calculating total songs, unique artists, albums, genres; songs per genre; songs & albums per artist; songs per album | ✅ Complete |
| **Docker Packaging** | Multi-stage production `Dockerfile` (server & client) + `docker-compose.yml` linking API & MongoDB | ✅ Complete |
| **Strict TypeScript** | 100% strict typing with **zero `any` types** across backend and frontend | ✅ Complete |
| **React 18 & UI** | Single Page Application with High-Level Stats Dashboard, Song Library (Grid & Table views), and Modals | ✅ Complete |
| **Redux Toolkit + Redux-Saga** | Slices for `songs`, `stats`, `filter`, `ui`; Saga workers with `takeLatest` handling all asynchronous API calls | ✅ Complete |
| **Automatic Reactive Updates** | Create, update, delete, or seed actions automatically refresh both song list and stats without page reload | ✅ Complete |
| **Emotion & Styled-System** | Theme token architecture (colors, typography, radii, glow shadows, spacing) powering responsive primitives | ✅ Complete |
| **Bonus: Search & Filter** | Debounced real-time search across all fields + interactive genre filter pills & distribution bars | ✅ Complete |
| **Bonus: Sample Data Seeder** | One-click instant seeder with 17 curated songs across diverse artists and genres | ✅ Complete |

---

## 🧠 Concepts, Logic & Reasoning Deep Dive

### 1. Backend Architecture & MongoDB Aggregation (`$facet`)
- **Why `$facet`?** Traditional approaches make 4 separate roundtrip database queries to calculate overall counts, genre breakdowns, artist catalogs, and album counts. By using MongoDB's `$facet` aggregation stage, we execute all 4 independent analytical pipelines in **a single database operation** over the database cluster.
- **Distinct Counts via Sets:** We utilize `$addToSet` inside grouping stages to gather unique artist/album/genre arrays, then evaluate `{ $size: '$uniqueArtists' }` in the projection stage.
- **Schema Optimization:** Text indexes are applied on `title`, `artist`, `album`, and `genre` to support flexible case-insensitive querying.

### 2. Frontend State Management with Redux Toolkit & Redux-Saga
- **Separation of Concerns:** Redux Toolkit manages purely synchronous state transitions (`loading`, `data`, `errors`, `filters`, `modal visibility`), while Redux-Saga orchestrates asynchronous side-effects and complex API workflows.
- **`takeLatest` Concurrency Control:** When a user types rapidly in the search bar or applies multiple filters, `takeLatest` automatically cancels pending API calls and only resolves the most recent request, preventing race conditions and stale UI renders.
- **Automatic Reactivity Pattern:** In `songSaga.ts`, upon the success of a creation, update, or deletion worker:
  ```typescript
  // Dispatches success action
  yield put(createSongSuccess(createdSong));
  yield put(closeCreateModal());
  yield put(showToast({ message: 'Song created successfully!', type: 'success' }));
  
  // Reactively re-fetches latest statistics and library list without page reload
  yield put(fetchStatsRequest());
  yield put(fetchSongsRequest());
  ```

### 3. Emotion & Styled-System Token Design System
- **Theme-Driven Layouts:** Instead of hardcoded styles, UI components consume centralized tokens from [theme.ts](file:///e:/dasktopp/my_proj/song-management-app/client/src/theme/theme.ts) (palette, spacing scale, font scales, radii, and glassmorphism shadows).
- **Reusable Primitives:** `Box`, `Flex`, `Grid`, `Text`, `Heading`, `Button`, `Input`, `Badge`, `Card`, `Modal`, and `Spinner` provide a design-system experience.

---

## 📂 Project Structure

```text
song-management-app/
├── docker-compose.yml           # Multi-container orchestration (Mongo, API, Client)
├── package.json                 # Root script runner
├── README.md                    # Detailed documentation
├── server/                      # Express + TypeScript + Mongoose Backend
│   ├── Dockerfile               # Multi-stage production Docker build
│   ├── tsconfig.json            # Strict TypeScript configuration
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app.ts               # Express app factory & middleware setup
│       ├── server.ts            # Server entrypoint & DB connection
│       ├── config/              # MongoDB & Environment configs
│       ├── controllers/         # CRUD + MongoDB $facet aggregation controllers
│       ├── middleware/          # Zod validation & error handling
│       ├── models/              # Strictly typed Song Mongoose schema
│       ├── routes/              # Express API route declarations
│       └── seeds/               # CLI & API database seeder
└── client/                      # React 18 + Redux-Saga + Emotion Frontend
    ├── Dockerfile               # Multi-stage production Docker build (Nginx)
    ├── nginx.conf               # Nginx reverse proxy configuration
    ├── tsconfig.json            # Strict TypeScript configuration
    ├── vite.config.ts           # Vite + Emotion config
    ├── package.json
    └── src/
        ├── App.tsx              # Root component with Emotion ThemeProvider
        ├── main.tsx             # Entrypoint mounting Redux store
        ├── api/                 # Axios HTTP client
        ├── theme/               # Theme tokens (colors, radii, space, shadows)
        ├── types/               # TypeScript interfaces (Song, StatsPayload, FilterState)
        ├── store/               # Redux Toolkit + Redux-Saga store architecture
        │   ├── index.ts         # Store configuration with Saga middleware
        │   ├── hooks.ts         # Typed useAppDispatch & useAppSelector
        │   ├── slices/          # songSlice, statSlice, filterSlice, uiSlice
        │   └── sagas/           # songSaga, statSaga, rootSaga
        └── components/
            ├── common/          # Styled-system primitives (Box, Flex, Grid, Text, Button, Modal, Card, etc.)
            ├── layout/          # Header, Toast notifications
            ├── stats/           # StatsOverview, MetricCard, GenreDistribution, ArtistStats, AlbumStats
            └── songs/           # SongLibrary, SongCard, SongTable, SongFilterBar, SongFormModal, DeleteConfirmModal
```

---

## ⚡ Quick Start & Local Development

### Option 1: One-Click Docker Compose (Production Setup)

Ensure Docker Desktop is running, then run:

```bash
docker compose up --build -d
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api/songs](http://localhost:5000/api/songs)
- **MongoDB Database:** `localhost:27017`

To stop containers:
```bash
docker compose down
```

---

### Option 2: Running Locally in Development Mode

#### 1. Start MongoDB
```bash
# Start MongoDB locally or via Docker
docker run -d -p 27017:27017 --name local_mongo mongo:7.0
```

#### 2. Start Backend API
```bash
cd server
npm install
npm run dev      # Starts ts-node-dev server on http://localhost:5000
```

#### 3. Start Frontend Client
```bash
cd ../client
npm install
npm run dev      # Starts Vite dev server on http://localhost:3000
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/songs` | List songs with optional search & genre filters | `?genre=Pop&search=Weeknd` |
| `POST` | `/api/songs` | Create a new song | `{ title, artist, album, genre, duration }` |
| `GET` | `/api/songs/:id` | Get single song by ID | URL parameter `:id` |
| `PUT` | `/api/songs/:id` | Update song by ID | Partial song fields in body |
| `DELETE` | `/api/songs/:id` | Delete song by ID | URL parameter `:id` |
| `GET` | `/api/songs/stats` | **MongoDB `$facet` Aggregation Statistics** | None |
| `POST` | `/api/songs/seed` | Seed database with sample songs | None |
| `GET` | `/api/health` | Healthcheck endpoint | None |

---

## 📊 MongoDB Aggregation Pipeline (`$facet`)

Implemented in [songController.ts](file:///e:/dasktopp/my_proj/song-management-app/server/src/controllers/songController.ts):

```typescript
const aggregationResult = await Song.aggregate([
  {
    $facet: {
      // 1. Overall counts: Total songs, unique artists, unique albums, unique genres
      overallTotals: [
        {
          $group: {
            _id: null,
            totalSongs: { $sum: 1 },
            uniqueArtists: { $addToSet: '$artist' },
            uniqueAlbums: { $addToSet: '$album' },
            uniqueGenres: { $addToSet: '$genre' },
          },
        },
        {
          $project: {
            _id: 0,
            totalSongs: 1,
            totalArtists: { $size: '$uniqueArtists' },
            totalAlbums: { $size: '$uniqueAlbums' },
            totalGenres: { $size: '$uniqueGenres' },
          },
        },
      ],

      // 2. Count of songs per genre
      songsPerGenre: [
        {
          $group: {
            _id: '$genre',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1, _id: 1 } },
        {
          $project: {
            _id: 0,
            genre: '$_id',
            count: 1,
          },
        },
      ],

      // 3. Count of songs and distinct albums per artist
      songsAndAlbumsPerArtist: [
        {
          $group: {
            _id: '$artist',
            totalSongs: { $sum: 1 },
            albums: { $addToSet: '$album' },
          },
        },
        {
          $project: {
            _id: 0,
            artist: '$_id',
            totalSongs: 1,
            totalAlbums: { $size: '$albums' },
          },
        },
        { $sort: { totalSongs: -1, artist: 1 } },
      ],

      // 4. Count of songs per album
      songsPerAlbum: [
        {
          $group: {
            _id: { album: '$album', artist: '$artist' },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            album: '$_id.album',
            artist: '$_id.artist',
            count: 1,
          },
        },
        { $sort: { count: -1, album: 1 } },
      ],
    },
  },
]);
```

---

## 🌐 Bonus: Deployment Guide

### Deploying Backend to Render / Railway
1. **Create MongoDB Atlas Cluster:** Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and obtain the connection string (`mongodb+srv://...`).
2. **Deploy on Render:**
   - Connect your GitHub repository.
   - Select **Web Service**, set Root Directory to `server`.
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Set Environment Variables:
     - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
     - `PORT`: `5000`
     - `NODE_ENV`: `production`
     - `CORS_ORIGIN`: `*` (or your frontend deployment URL)

### Deploying Frontend to Vercel / Netlify
1. **Deploy on Vercel:**
   - Import repository on [Vercel](https://vercel.com).
   - Set Root Directory to `client`.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Set Environment Variable:
     - `VITE_API_URL`: `<Your Backend Render/Railway URL>/api` (e.g. `https://song-api.onrender.com/api`)
2. **Deploy on Netlify:**
   - Import repository on [Netlify](https://netlify.com).
   - Base Directory: `client`
   - Build Command: `npm run build`
   - Publish Directory: `client/dist`
   - Set Environment Variable: `VITE_API_URL`.

---

## 🧪 Verification & Build Status

- **Backend TypeScript Build:** `npm run build` in `server/` compiles with 0 errors.
- **Frontend TypeScript Build:** `npm run build` in `client/` compiles with strict type safety.
- **Zero `any` Types:** All state interfaces, payloads, saga effects, and props are strictly typed.
"# swenetix-studio" 
