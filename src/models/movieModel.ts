import mongoose, { Schema, Document } from 'mongoose';

// Define the Movie document interface
export interface MovieDocument extends Document {
  title: string;
  duration?: string;
  releaseDate?: Date;
  genre: string;
  rating: number;
  streamingLink: string;
  director?: string;
  description?: string;
  leadActors?: string[];
}

// Create the Movie schema
const movieSchema = new Schema<MovieDocument>({
  title: { type: String, required: true },
  duration: { type: String, required: false },
  releaseDate: { type: Date, required: false },
  genre: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  streamingLink: { type: String, required: true },
  director: { type: String, required: false },
  description: { type: String, required: false },
  leadActors: { type: [String], required: false },
});


// Create text index for full-text search
movieSchema.index({
  title: 'text',
  genre: 'text',
  director: 'text',
  leadActors: 'text'
});


// Create the Movie model
const MovieModel = mongoose.model<MovieDocument>('Movie', movieSchema);

export default MovieModel;
