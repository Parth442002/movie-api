import express,{ Response,Request } from 'express';
require("dotenv").config();

//Local Imports
import MovieModel,{ MovieDocument } from '../models/movieModel';
import UserModel,{ UserDocument } from '../models/userModel';
import { verifyToken } from '../middleware/auth';
import redis from '../config/redis';

const router = express.Router();


//Get All The movies
router.get('/',verifyToken, async (req: Request, res: Response) => {
  try {
    const cached_movies = await redis.get('movies'); //Checking First in Cache
    if(cached_movies){
      console.log("Cached movies Found!")
      return res.status(200).send(JSON.parse(cached_movies));
    }else{
      const movies: MovieDocument[] = await MovieModel.find();
      console.log("No Cached movies found!")
      await redis.set('movies', JSON.stringify(movies),'EX', 60 * 60); //Expire in 1 hour
      return res.status(200).send(movies);
    }
  } catch (error) {
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Get a specific movie
router.get('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie: MovieDocument | null = await MovieModel.findById(id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    return res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add new movie
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {

    // Check if the user is an admin
    const user: UserDocument | null = await UserModel.findById(req.user.id);
    if (!user || !user.is_admin) {
      return res.status(403).send({ error: 'Unauthorized. Only admins can add movies.' });
    }

    // Check if all required attributes are present in the request body
    const { title, genre, rating, streamingLink } = req.body;
    if (!title || !genre || !rating || !streamingLink) {
      return res.status(400).send({ error: 'Missing required attributes for movie creation.' });
    }

    // Create the new movie
    const newMovie = await MovieModel.create(req.body);
    // Delete the corresponding movie cache
    await redis.del(`movies`);

    return res.status(201).json(newMovie);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Update a movie
router.put('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    // Check if the user is an admin
    const user: UserDocument | null = await UserModel.findById(req.user.id);
    if (!user || !user.is_admin) {
      return res.status(403).send({ error: 'Unauthorized. Only admins can update movies.' });
    }

    const { id } = req.params;
    const updatedMovieAttributes = req.body;

    // Check if the movie exists
    const existingMovie: MovieDocument | null = await MovieModel.findById(id);
    if (!existingMovie) {
      return res.status(404).send({ error: 'Movie not found' });
    }

    // Update the movie attributes dynamically
    Object.assign(existingMovie, updatedMovieAttributes);

    // Save the updated movie
    const updatedMovie = await existingMovie.save();

    // Delete the corresponding movie cache
    await redis.del(`movies`);

    return res.status(200).send(updatedMovie);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});


// DELETE /movies/:id - Delete a movie from the lobby
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    // Check if the user is an admin
    const { id } = req.params;
    const user: UserDocument | null = await UserModel.findById(req.user.id);
    if (!user || !user.is_admin) {
      return res.status(403).send({ error: 'Unauthorized. Only admins can delete movies.' });
    }

    // Check if the movie exists
    const existingMovie: MovieDocument | null = await MovieModel.findById(id);
    if (!existingMovie) {
      return res.status(404).send({ error: 'Movie not found' });
    }

    // Delete the movie
    await existingMovie.deleteOne();

    // Delete the corresponding cache key
    await redis.del(`movies`);

    return res.status(204).send(); // No content response
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});




export default router;
