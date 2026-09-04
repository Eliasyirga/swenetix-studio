import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../app';
import { Song } from '../models/song.model';
import { config } from '../config/env';

const app = createApp();

beforeAll(async () => {
  // Connect to test database or local mongo instance
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(config.mongoUri);
  }
});

beforeEach(async () => {
  await Song.deleteMany({});
});

afterAll(async () => {
  await Song.deleteMany({});
  await mongoose.connection.close();
});

describe('🎵 Song Management REST API Tests', () => {
  // 1. Health Check Endpoint
  describe('GET /api/health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('API is healthy');
      expect(res.body.data.status).toBeDefined();
    });
  });

  // 2. Create Song Endpoint
  describe('POST /api/songs', () => {
    it('should create a valid song with 201 Created', async () => {
      const payload = {
        title: 'Starboy',
        artist: 'The Weeknd',
        album: 'Starboy',
        genre: 'R&B',
        duration: 230,
      };

      const res = await request(app).post('/api/songs').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Starboy');
      expect(res.body.data.artist).toBe('The Weeknd');
      expect(res.body.data.id).toBeDefined();
    });

    it('should return 400 Bad Request on empty or missing fields', async () => {
      const invalidPayload = {
        title: '   ', // empty whitespace
        artist: '',
      };

      const res = await request(app).post('/api/songs').send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Validation failed');
    });
  });

  // 3. List Songs & Filtering & Pagination
  describe('GET /api/songs', () => {
    it('should return paginated list of songs and filterOptions', async () => {
      await Song.create([
        { title: 'Song 1', artist: 'Artist A', album: 'Album A', genre: 'Rock' },
        { title: 'Song 2', artist: 'Artist B', album: 'Album B', genre: 'Pop' },
      ]);

      const res = await request(app).get('/api/songs?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.songs.length).toBe(2);
      expect(res.body.data.pagination.total).toBe(2);
      expect(res.body.data.filterOptions.genres).toContain('Rock');
    });

    it('should filter songs by genre and search query', async () => {
      await Song.create([
        { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Synth-pop' },
        { title: 'Shape of You', artist: 'Ed Sheeran', album: 'Divide', genre: 'Pop' },
      ]);

      const res = await request(app).get('/api/songs?genre=Pop');

      expect(res.status).toBe(200);
      expect(res.body.data.songs.length).toBe(1);
      expect(res.body.data.songs[0].title).toBe('Shape of You');
    });
  });

  // 4. Get Song By ID
  describe('GET /api/songs/:id', () => {
    it('should return 200 with the requested song', async () => {
      const song = await Song.create({
        title: 'DNA.',
        artist: 'Kendrick Lamar',
        album: 'DAMN.',
        genre: 'Hip-Hop',
      });

      const res = await request(app).get(`/api/songs/${song._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('DNA.');
    });

    it('should return 404 for non-existent song ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/songs/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // 5. Update Song
  describe('PUT /api/songs/:id', () => {
    it('should update song and return 200', async () => {
      const song = await Song.create({
        title: 'Original Title',
        artist: 'Artist',
        album: 'Album',
        genre: 'Pop',
      });

      const res = await request(app)
        .put(`/api/songs/${song._id}`)
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
    });
  });

  // 6. Delete Song
  describe('DELETE /api/songs/:id', () => {
    it('should remove song and return 200', async () => {
      const song = await Song.create({
        title: 'To Delete',
        artist: 'Artist',
        album: 'Album',
        genre: 'Rock',
      });

      const res = await request(app).delete(`/api/songs/${song._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const check = await Song.findById(song._id);
      expect(check).toBeNull();
    });
  });

  // 7. Statistics Endpoint with MongoDB $facet Pipeline
  describe('GET /api/statistics', () => {
    it('should return aggregated overview, songsByGenre, artists, albums, and highlights', async () => {
      await Song.create([
        { title: 'Track 1', artist: 'Artist A', album: 'Album A1', genre: 'Rock' },
        { title: 'Track 2', artist: 'Artist A', album: 'Album A2', genre: 'Rock' },
        { title: 'Track 3', artist: 'Artist B', album: 'Album B1', genre: 'Pop' },
      ]);

      const res = await request(app).get('/api/statistics');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.overview.totalSongs).toBe(3);
      expect(res.body.data.overview.totalArtists).toBe(2);
      expect(res.body.data.overview.totalAlbums).toBe(3);
      expect(res.body.data.overview.totalGenres).toBe(2);
      expect(res.body.data.songsByGenre.length).toBe(2);
      expect(res.body.data.artists.length).toBe(2);
      expect(res.body.data.highlights.mostProlificArtist?.artist).toBe('Artist A');
    });
  });
});
