import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import songRoutes from './routes/song.routes';
import statisticsRoutes from './routes/statistics.routes';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { config } from './config/env';
import { ApiResponse } from './utils/apiResponse';

export const createApp = (): Application => {
  const app: Application = express();

  // Middleware
  app.use(
    cors({
      origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(','),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health Check Endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    ApiResponse.success(
      res,
      {
        status: isDbConnected ? 'healthy' : 'degraded',
        database: isDbConnected ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      'API is healthy'
    );
  });

  // Welcome / Root Endpoint
  app.get(['/', '/api'], (_req: Request, res: Response) => {
    ApiResponse.success(
      res,
      {
        name: 'Swenetix Studio API',
        version: '1.0.0',
        documentation: 'https://github.com/Eliasyirga/swenetix-studio/blob/main/docs/API_DOCUMENTATION.md',
        endpoints: {
          health: '/api/health',
          songs: '/api/songs',
          statistics: '/api/statistics',
          seed: 'POST /api/songs/seed',
        },
      },
      'Welcome to Swenetix Studio REST API'
    );
  });

  // REST API Routes
  app.use('/api/songs', songRoutes);
  app.use('/api/statistics', statisticsRoutes);

  // 404 Handler
  app.use(notFoundHandler);

  // Centralized Global Error Handler
  app.use(errorHandler);

  return app;
};
