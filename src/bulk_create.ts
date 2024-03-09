import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserModel, { UserDocument } from './models/userModel';
import MovieModel, { MovieDocument } from './models/movieModel';
import moviesData from './data/movies.json';
import usersData from './data/users.json';

// Function to create users
export const createUsers = async () => {
  try {
    const users: UserDocument[] = [];

    for (const userData of usersData) {
      const { username, phoneNumber, password, is_admin } = userData;
      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserModel.create({
        username,
        phoneNumber,
        password: encryptedPassword,
        is_admin,
      });

      users.push(newUser);
    }

    console.log('Users created successfully:');
  } catch (error) {
    console.error('Error creating users:', error);
  }
};

// Function to create movies
export const createMovies = async () => {
  try {
    const movies: MovieDocument[] = [];

    for (const movieData of moviesData) {
      const newMovie = await MovieModel.create(movieData);
      movies.push(newMovie);
    }

    console.log('Movies created successfully:');
  } catch (error) {
    console.error('Error creating movies:', error);
  }
};

