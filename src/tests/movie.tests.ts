import request from 'supertest';
import {app} from "../index"

describe('GET /movies', () => {
  it('should fetch all movies', async () => {
    const response = await request(app).get('/movies');
    expect(response.status).toBe(200);
  });

  it('should return cached movies if available', async () => {
    const response = await request(app).get('/movies');
    expect(response.status).toBe(200);
  });

  it('should return 500 if an error occurs', async () => {
    const response = await request(app).get('/movies');
    expect(response.status).toBe(500);
  });
});

describe('GET /movies/:id', () => {
  it('should fetch a specific movie by ID', async () => {
    const response = await request(app).get('/movies/1234567890');
    expect(response.status).toBe(200);
  });

  it('should return 404 if movie is not found', async () => {
    const response = await request(app).get('/movies/nonexistentid');
    expect(response.status).toBe(404);
  });
});

describe('POST /movies', () => {
  it('should add a new movie', async () => {
    const newMovieData = {
      title: 'New Movie',
      genre: 'Action',
      rating: 4.5,
      streamingLink: 'http://example.com/new_movie'
    };
    const response = await request(app).post('/movies').send(newMovieData);
    expect(response.status).toBe(201);
  });

  it('should return 403 if user is not an admin', async () => {
    const response = await request(app).post('/movies').send({});
    expect(response.status).toBe(403);
  });

  it('should return 400 if required attributes are missing', async () => {
    const response = await request(app).post('/movies').send({});
    expect(response.status).toBe(400);
  });
});

describe('PUT /movies/:id', () => {
  it('should update an existing movie', async () => {
    const updatedMovieData = {
      title: 'Updated Movie Title',
      genre: 'Updated Genre',
      rating: 4.8,
      streamingLink: 'http://example.com/updated_movie'
    };
    const response = await request(app).put('/movies/1234567890').send(updatedMovieData);
    expect(response.status).toBe(200);
  });

  it('should return 404 if movie to update is not found', async () => {
    const response = await request(app).put('/movies/nonexistentid').send({});
    expect(response.status).toBe(404);
  });
});

describe('DELETE /movies/:id', () => {
  it('should delete an existing movie', async () => {
    const response = await request(app).delete('/movies/1234567890');
    expect(response.status).toBe(204);
  });

  it('should return 404 if movie to delete is not found', async () => {
    const response = await request(app).delete('/movies/nonexistentid');
    expect(response.status).toBe(404);
  });
});
