# 📡 Swenetix Studio — REST API Specification

This document provides the complete API reference for the **Swenetix Studio Backend REST API**.

- **Base URL (Local)**: `http://localhost:5000/api`
- **Default Content-Type**: `application/json`

---

## 📑 Endpoints Overview

| Method | Path | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health check | Public |
| `GET` | `/songs` | Fetch songs with search, filtering & pagination | Public |
| `POST` | `/songs` | Create a new song | Public |
| `GET` | `/songs/:id` | Fetch a single song by ID | Public |
| `PUT` | `/songs/:id` | Update an existing song by ID | Public |
| `DELETE` | `/songs/:id` | Delete a song by ID | Public |
| `POST` | `/songs/seed` | Seed the database with authentic tracks | Public |
| `GET` | `/statistics` | Fetch aggregated catalog analytics ($facet) | Public |

---

## 1. Health Check

### `GET /api/health`
Returns the operational health and uptime of the API.

#### Response: `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2026-09-05T10:19:48.000Z",
  "uptime": 124.52,
  "database": "connected"
}
```

---

## 2. Song Management (`/api/songs`)

### `GET /api/songs`
Retrieves a paginated list of songs with optional full-text search and category filtering.

#### Query Parameters
| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `page` | `number` | No | `1` | Page number for pagination |
| `limit` | `number` | No | `10` | Items per page (max `100`) |
| `search` | `string` | No | `""` | Keyword search matching `title`, `artist`, or `album` |
| `genre` | `string` | No | `""` | Filter by specific genre (e.g. `Rock`, `Afrobeats`) |
| `artist` | `string` | No | `""` | Filter by specific artist name |
| `album` | `string` | No | `""` | Filter by album title |
| `sortBy` | `string` | No | `createdAt` | Field to sort by (`title`, `artist`, `album`, `createdAt`) |
| `sortOrder` | `string` | No | `desc` | Sort order: `asc` or `desc` |

#### Example Request:
```bash
curl -X GET "http://localhost:5000/api/songs?page=1&limit=5&genre=Pop"
```

#### Response: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "66da074094a9a081534e3201",
      "title": "Blinding Lights",
      "artist": "The Weeknd",
      "album": "After Hours",
      "genre": "Pop",
      "duration": 200,
      "createdAt": "2026-09-05T10:19:48.000Z",
      "updatedAt": "2026-09-05T10:19:48.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 59,
    "totalPages": 12,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### `POST /api/songs`
Creates a new song in the library.

#### Request Body
| Field | Type | Required | Constraints |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Yes** | 1 - 200 characters |
| `artist` | `string` | **Yes** | 1 - 200 characters |
| `album` | `string` | **Yes** | 1 - 200 characters |
| `genre` | `string` | **Yes** | 1 - 100 characters |
| `duration` | `number` | No | Positive integer (seconds) |

#### Example Request:
```bash
curl -X POST "http://localhost:5000/api/songs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Starboy",
    "artist": "The Weeknd",
    "album": "Starboy",
    "genre": "R&B"
  }'
```

#### Response: `201 Created`
```json
{
  "success": true,
  "message": "Song created successfully",
  "data": {
    "_id": "66da074094a9a081534e3299",
    "title": "Starboy",
    "artist": "The Weeknd",
    "album": "Starboy",
    "genre": "R&B",
    "createdAt": "2026-09-05T10:20:00.000Z",
    "updatedAt": "2026-09-05T10:20:00.000Z"
  }
}
```

---

### `GET /api/songs/:id`
Fetch a specific song by its 24-character hexadecimal MongoDB `_id`.

#### Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "66da074094a9a081534e3201",
    "title": "Blinding Lights",
    "artist": "The Weeknd",
    "album": "After Hours",
    "genre": "Pop"
  }
}
```

#### Response: `404 Not Found`
```json
{
  "success": false,
  "message": "Song not found with id 66da074094a9a081534e3999"
}
```

---

### `PUT /api/songs/:id`
Updates an existing song. You can pass partial or complete fields in the JSON body.

#### Example Request:
```bash
curl -X PUT "http://localhost:5000/api/songs/66da074094a9a081534e3201" \
  -H "Content-Type: application/json" \
  -d '{
    "genre": "Synth-Pop"
  }'
```

#### Response: `200 OK`
```json
{
  "success": true,
  "message": "Song updated successfully",
  "data": {
    "_id": "66da074094a9a081534e3201",
    "title": "Blinding Lights",
    "artist": "The Weeknd",
    "album": "After Hours",
    "genre": "Synth-Pop",
    "updatedAt": "2026-09-05T10:22:00.000Z"
  }
}
```

---

### `DELETE /api/songs/:id`
Deletes a song permanently from the database.

#### Example Request:
```bash
curl -X DELETE "http://localhost:5000/api/songs/66da074094a9a081534e3201"
```

#### Response: `200 OK`
```json
{
  "success": true,
  "message": "Song deleted successfully",
  "data": {
    "_id": "66da074094a9a081534e3201"
  }
}
```

---

## 3. Analytics & Statistics (`/api/statistics`)

### `GET /api/statistics`
Computes and returns high-level overall statistics and grouped analytics using MongoDB's `$facet` pipeline.

#### Example Request:
```bash
curl -X GET "http://localhost:5000/api/statistics"
```

#### Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalSongs": 59,
      "totalArtists": 24,
      "totalAlbums": 32,
      "totalGenres": 8
    },
    "songsByGenre": [
      { "genre": "Pop", "count": 14 },
      { "genre": "Hip-Hop", "count": 12 },
      { "genre": "Afrobeats", "count": 9 },
      { "genre": "Rock", "count": 8 },
      { "genre": "R&B", "count": 7 },
      { "genre": "Electronic", "count": 5 },
      { "genre": "Jazz", "count": 2 },
      { "genre": "Reggae", "count": 2 }
    ],
    "artists": [
      { "artist": "The Weeknd", "totalSongs": 6, "totalAlbums": 3 },
      { "artist": "Burna Boy", "totalSongs": 5, "totalAlbums": 2 },
      { "artist": "Daft Punk", "totalSongs": 4, "totalAlbums": 2 }
    ],
    "albums": [
      { "album": "After Hours", "artist": "The Weeknd", "totalSongs": 4 },
      { "album": "Love, Damini", "artist": "Burna Boy", "totalSongs": 3 },
      { "album": "Random Access Memories", "artist": "Daft Punk", "totalSongs": 3 }
    ]
  }
}
```

---

## 4. Error Response Schema

All errors adhere to a predictable, standardized envelope:

```json
{
  "success": false,
  "message": "Human-readable description of error",
  "errors": [
    "Optional list of validation error strings"
  ]
}
```
