# 👨‍💻 Swenetix Studio — Developer Onboarding & Contribution Guide

Welcome to the **Swenetix Studio** codebase! This guide is designed to get new developers up and running quickly, explaining the development workflows, codebase conventions, and step-by-step guides for adding new features.

---

## 📑 Table of Contents
1. [Prerequisites & Development Setup](#1-prerequisites--development-setup)
2. [Project Structure Deep Dive](#2-project-structure-deep-dive)
3. [Running the Application Locally](#3-running-the-application-locally)
4. [How-To: Add a New Feature Step-by-Step](#4-how-to-add-a-new-feature-step-by-step)
   - [Step A: Backend Model & DTO](#step-a-backend-model--dto)
   - [Step B: Backend Service & Controller](#step-b-backend-service--controller)
   - [Step C: Backend REST Route & Validation](#step-c-backend-rest-route--validation)
   - [Step D: Frontend TypeScript Types & API Client](#step-d-frontend-typescript-types--api-client)
   - [Step E: Redux Slice & Saga Flow](#step-e-redux-slice--saga-flow)
   - [Step F: React Component UI](#step-f-react-component-ui)
5. [Code Quality & TypeScript Standards](#5-code-quality--typescript-standards)
6. [Testing & Verification](#6-testing--verification)
7. [Debugging & Troubleshooting](#7-debugging--troubleshooting)

---

## 1. Prerequisites & Development Setup

Make sure you have the following installed on your machine:
- **Node.js**: v18.0.0 or newer (v20+ LTS recommended)
- **npm**: v9.0.0 or newer
- **Git**: For version control
- **MongoDB**: A local instance or a free [MongoDB Atlas Cluster](https://cloud.mongodb.com/)
- **Docker & Docker Compose** (Optional, for containerized execution)

---

## 2. Project Structure Deep Dive

```text
song-management-app/
├── package.json                 # Monorepo root scripts (dev, build, test, seed)
├── docker-compose.yml           # Production multi-container composition
├── README.md                    # Project overview & quick start
├── docs/                        # Comprehensive technical documentation
│   ├── ARCHITECTURE.md          # System architecture, data flow & $facet deep dive
│   ├── DEVELOPER_GUIDE.md       # (This file) Developer workflows & guide
│   └── API_DOCUMENTATION.md     # OpenAPI / REST API specification & schemas
│
├── server/                      # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/              # DB connection & environment variables
│   │   ├── controllers/         # Request handling & HTTP response formatting
│   │   ├── middleware/          # Validation, error handling, CORS
│   │   ├── models/              # Mongoose schemas & MongoDB indexing
│   │   ├── routes/              # Express endpoint routing
│   │   ├── seeds/               # Track seed data generator
│   │   ├── services/            # Business logic & aggregation pipelines
│   │   ├── types/               # TypeScript interfaces & DTOs
│   │   ├── app.ts               # Express application setup
│   │   └── server.ts            # Entry point & DB connection bootstrap
│   ├── package.json
│   └── tsconfig.json
│
└── client/                      # React 18 + Redux-Saga + Emotion Frontend
    ├── src/
    │   ├── components/          # Reusable UI primitives & widgets (Table, Modal, etc.)
    │   ├── context/             # Sidebar collapsible state context
    │   ├── pages/               # StartPage, Songs, Statistics, Home
    │   ├── routes/              # React Router definitions
    │   ├── services/            # Axios API client
    │   ├── store/               # Redux Toolkit slices, Saga handlers, root store
    │   ├── theme/               # Emotion theme tokens & Styled-System definitions
    │   ├── types/               # Frontend TypeScript domain types
    │   ├── App.tsx              # Main layout wrapper
    │   └── main.tsx             # React DOM root
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

---

## 3. Running the Application Locally

### Quick Start (All-in-One)
```bash
# 1. Install root, backend, and frontend dependencies
npm run install:all

# 2. Configure server/.env
# Copy server/.env.example to server/.env and fill in your MONGODB_URI

# 3. Seed database with real curated tracks
npm run seed --prefix server

# 4. Start both backend and frontend concurrently
npm run dev
```

### Running Backend Independently
```bash
cd server
npm install
npm run dev
# Server starts at http://localhost:5000
# Healthcheck: http://localhost:5000/api/health
```

### Running Frontend Independently
```bash
cd client
npm install
npm run dev
# Client starts at http://localhost:3000
```

---

## 4. How-To: Add a New Feature Step-by-Step

Let's walk through an example: **Adding a `releaseYear` or `bpm` field to the Song entity**.

### Step A: Backend Model & DTO
1. Open [`server/src/types/song.types.ts`](file:///e:/dasktopp/my_proj/song-management-app/server/src/types/song.types.ts) and add the property:
   ```typescript
   export interface ISong {
     title: string;
     artist: string;
     album: string;
     genre: string;
     releaseYear?: number;
   }
   ```
2. Open [`server/src/models/song.model.ts`](file:///e:/dasktopp/my_proj/song-management-app/server/src/models/song.model.ts) and add to schema:
   ```typescript
   releaseYear: {
     type: Number,
     min: 1900,
     max: 2100,
   }
   ```

### Step B: Backend Service & Controller
- Because the service methods [`song.service.ts`](file:///e:/dasktopp/my_proj/song-management-app/server/src/services/song.service.ts) use Mongoose's `Song.create()` and `Song.findByIdAndUpdate()`, the new field is automatically handled.
- If you need special aggregation or validation for `releaseYear`, update [`server/src/services/statistics.service.ts`](file:///e:/dasktopp/my_proj/song-management-app/server/src/services/statistics.service.ts).

### Step C: Backend REST Route & Validation
1. Open [`server/src/middleware/validate.middleware.ts`](file:///e:/dasktopp/my_proj/song-management-app/server/src/middleware/validate.middleware.ts) (or your Zod schema file) and add the field:
   ```typescript
   export const createSongSchema = z.object({
     title: z.string().min(1, 'Title is required'),
     artist: z.string().min(1, 'Artist is required'),
     album: z.string().min(1, 'Album is required'),
     genre: z.string().min(1, 'Genre is required'),
     releaseYear: z.number().int().min(1900).max(2100).optional(),
   });
   ```

### Step D: Frontend TypeScript Types & API Client
1. Open [`client/src/types/song.types.ts`](file:///e:/dasktopp/my_proj/song-management-app/client/src/types/song.types.ts):
   ```typescript
   export interface Song {
     _id: string;
     title: string;
     artist: string;
     album: string;
     genre: string;
     releaseYear?: number;
     createdAt?: string;
     updatedAt?: string;
   }
   ```

### Step E: Redux Slice & Saga Flow
- The state slices ([`client/src/store/songsSlice.ts`](file:///e:/dasktopp/my_proj/song-management-app/client/src/store/songsSlice.ts)) and sagas ([`client/src/store/songsSaga.ts`](file:///e:/dasktopp/my_proj/song-management-app/client/src/store/songsSaga.ts)) work with the generic `Song` and `CreateSongDto` types.
- Once you update the interface in Step D, TypeScript will validate action payloads everywhere automatically!

### Step F: React Component UI
1. Add the field to the input form modal in [`client/src/components/SongModal.tsx`](file:///e:/dasktopp/my_proj/song-management-app/client/src/components/SongModal.tsx).
2. Render the column in [`client/src/components/SongTable.tsx`](file:///e:/dasktopp/my_proj/song-management-app/client/src/components/SongTable.tsx) or the badge in [`client/src/components/SongCard.tsx`](file:///e:/dasktopp/my_proj/song-management-app/client/src/components/SongCard.tsx).

---

## 5. Code Quality & TypeScript Standards

- **Strict Mode**: `strict: true` is enabled on both client and server `tsconfig.json`.
- **Zero `any`**: Explicitly type every function return, action payload, and parameter. If a type is unknown, use `unknown` with a type guard.
- **Emotion & Styled-System**: Use theme tokens (`theme.colors.*`, `theme.space.*`) instead of hardcoded hex colors or raw pixel values.
- **Redux-Saga**: Always use typed effects (`yield call(...)`, `yield put(...)`) and wrap saga worker functions with `try/catch` dispatching failure actions.

---

## 6. Testing & Verification

### Running Server Tests
```bash
cd server
npm test
```

### Checking TypeScript Compilation
```bash
# Server
cd server
npx tsc --noEmit

# Client
cd client
npm run build
```

---

## 7. Debugging & Troubleshooting

### MongoDB Atlas Connection Issues
- **Error**: `MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster`
- **Solution**:
  1. Ensure your IP address is whitelisted in MongoDB Atlas under **Network Access** (or set `0.0.0.0/0` for universal access).
  2. Verify your database username and password in `server/.env`.
  3. Ensure that your network or firewall allows outbound traffic on port `27017`.

### Redux-Saga Debugging
- All dispatched actions can be inspected in browser dev tools with Redux DevTools Extension enabled.
- Check the console for dispatched toast notifications (`showToast`).
