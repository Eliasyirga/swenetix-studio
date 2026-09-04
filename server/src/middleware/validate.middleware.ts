import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiResponse } from '../utils/apiResponse';

export const createSongSchema = z.object({
  title: z
    .string({ required_error: 'Song title is required' })
    .trim()
    .min(1, 'Song title cannot be empty')
    .max(120, 'Song title cannot exceed 120 characters'),
  artist: z
    .string({ required_error: 'Artist name is required' })
    .trim()
    .min(1, 'Artist name cannot be empty')
    .max(120, 'Artist name cannot exceed 120 characters'),
  album: z
    .string({ required_error: 'Album name is required' })
    .trim()
    .min(1, 'Album name cannot be empty')
    .max(120, 'Album name cannot exceed 120 characters'),
  genre: z
    .string({ required_error: 'Genre is required' })
    .trim()
    .min(1, 'Genre cannot be empty')
    .max(60, 'Genre cannot exceed 60 characters'),
  duration: z.number().int().positive().max(7200).optional(),
});

export const updateSongSchema = createSongSchema.partial();

export const validateRequest =
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
        ApiResponse.error(res, 'Validation failed: Please verify all required fields', 400, errors);
        return;
      }
      next(error);
    }
  };
