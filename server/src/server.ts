import { createApp } from './app';
import { connectDB } from './config/database';
import { config } from './config/env';

const startServer = async (): Promise<void> => {
  // Connect to MongoDB
  await connectDB();

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`=========================================`);
    console.log(`Song Management REST API Server Started`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`URL:         http://localhost:${config.port}`);
    console.log(`Health:      http://localhost:${config.port}/api/health`);
    console.log(`Statistics:  http://localhost:${config.port}/api/statistics`);
    console.log(`=========================================`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch((err) => {
  console.error('[Server] Startup error:', err);
  process.exit(1);
});
