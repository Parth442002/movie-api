# Movie API

Movie API is a RESTful web service that allows users to access information about movies, register/login, and perform CRUD (Create, Read, Update, Delete) operations on movies.

## Features

- **Authentication**: Users can register, login, and get information about their profile.
- **Movies**: Users can retrieve a list of movies, search for movies, add new movies, update existing movies, and delete movies based on their role.
- **Search**: Users can search for movies by title, genre, or any other relevant keyword.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing movie and user data.
- **Mongoose**: MongoDB object modeling tool.
- **Redis**: In-memory data structure store for caching movie and user data.
- **JWT (JSON Web Tokens)**: Used for authentication and authorization.
- **bcrypt**: Library for hashing passwords.
- **ioredis**: Redis client for Node.js.

## Getting Started

### Prerequisites
- Docker installed on your machine
- Node.js installed on your machine

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/parth442002/movie-api.git
   ```
2. Install Docker on your system if not already installed

3. Please create a new .env file and set the values which are stored in sample.env file

4. CD into the repo
   ```bash
   cd movie-api
   ```

5. Run Docker Compose
   ```bash
   docker compose up --build
   ```

6. Checkout localhost:3000
   ```bash
   curl http:localhost:3000
   ```


## API Endpoints
  - /auth/register: Register a new user
  - /auth/login: Login with existing credentials
  - /auth: Get logged-in user information
  - /search?q={query} : Search for movies based on title,genre,director,leadActors
  - /movies: Get all movies
  - /movies/{id}: Get movie by ID
  - /movies/search?q={query}: Search for movies (logged In)
  - /movies: Add a new movie ( Admin Role)
  - /movies/{id}: Update a movie by ID (Admin Role)
  - /movies/{id}: Delete a movie by ID (Admin Role)


## Running the Tests
To run the tests, execute the following command:

```bash
npm test
```

[`Postman Documentation->`](https://documenter.getpostman.com/view/32108740/2sA2xh2YTk)