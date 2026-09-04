import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const createSongSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(120, 'Title cannot exceed 120 characters'),
  artist: z
    .string({ required_error: 'Artist is required' })
    .trim()
    .min(1, 'Artist cannot be empty')
    .max(120, 'Artist cannot exceed 120 characters'),
  album: z
    .string({ required_error: 'Album is required' })
    .trim()
    .min(1, 'Album cannot be empty')
    .max(120, 'Album cannot exceed 120 characters'),
  genre: z
    .string({ required_error: 'Genre is required' })
    .trim()
    .min(1, 'Genre cannot be empty')
    .max(60, 'Genre cannot exceed 60 characters'),
  duration: z.number().int().positive().max(7200).optional(),
});

export const updateSongSchema = createSongSchema.partial();

export const validate =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }
      next(error);
    }
  };
