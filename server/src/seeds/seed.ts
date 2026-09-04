import mongoose from 'mongoose';
import { config } from '../config/env';
import { SongService } from '../services/song.service';
import { sampleSeedTracks } from '../controllers/song.controller';

const runSeed = async () => {
  try {
    console.log(`[Seed] Connecting to MongoDB: ${config.mongoUri}...`);
    await mongoose.connect(config.mongoUri);
    console.log('[Seed] Database connected.');

    const count = await SongService.seedSongs(sampleSeedTracks);
    console.log(`[Seed] Successfully seeded ${count} sample tracks across diverse genres, artists, and albums.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
