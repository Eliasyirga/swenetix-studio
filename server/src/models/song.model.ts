import mongoose, { Document, Schema, Model } from 'mongoose';
import { ISong } from '../types/song.types';

export interface ISongDocument extends ISong, Document {
  _id: mongoose.Types.ObjectId;
}

const songSchema = new Schema<ISongDocument>(
  {
    title: {
      type: String,
      required: [true, 'Song title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
      index: true,
    },
    artist: {
      type: String,
      required: [true, 'Artist name is required'],
      trim: true,
      minlength: [1, 'Artist name cannot be empty'],
      maxlength: [120, 'Artist cannot exceed 120 characters'],
      index: true,
    },
    album: {
      type: String,
      required: [true, 'Album name is required'],
      trim: true,
      minlength: [1, 'Album name cannot be empty'],
      maxlength: [120, 'Album cannot exceed 120 characters'],
      index: true,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
      minlength: [1, 'Genre cannot be empty'],
      maxlength: [60, 'Genre cannot exceed 60 characters'],
      index: true,
    },
    duration: {
      type: Number,
      default: 210,
      min: [1, 'Duration must be at least 1 second'],
      max: [7200, 'Duration cannot exceed 2 hours'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

// Indexes for text search and rapid filter lookups
songSchema.index({ title: 'text', artist: 'text', album: 'text', genre: 'text' });
songSchema.index({ artist: 1, album: 1 });
songSchema.index({ genre: 1 });

export const Song: Model<ISongDocument> = mongoose.model<ISongDocument>('Song', songSchema);
