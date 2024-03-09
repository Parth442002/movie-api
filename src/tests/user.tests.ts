const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from 'app.js'
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

describe('User Routes', () => {
  describe('GET /auth/all', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/auth/all');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        phoneNumber: '1234567890',
        password: 'testpassword',
        username: 'testuser',
        is_admin: false
      };
      const response = await request(app).post('/auth/register').send(userData);
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.phoneNumber).toBe(userData.phoneNumber);
      expect(response.body.username).toBe(userData.username);
    });
  });

  describe('POST /auth/login', () => {
    it('should login an existing user', async () => {
      // First, create a test user
      const hashedPassword = await bcrypt.hash('testpassword', 10);
      const testUser = new UserModel({
        phoneNumber: '1234567890',
        password: hashedPassword,
        username: 'testuser',
        is_admin: false
      });
      await testUser.save();

      // Attempt login with the test user's credentials
      const loginData = {
        phoneNumber: '1234567890',
        password: 'testpassword'
      };
      const response = await request(app).post('/auth/login').send(loginData);
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.phoneNumber).toBe(loginData.phoneNumber);
      expect(response.body.username).toBe('testuser');
    });

    it('should return an error for invalid credentials', async () => {
      const loginData = {
        phoneNumber: 'invalidnumber',
        password: 'invalidpassword'
      };
      const response = await request(app).post('/auth/login').send(loginData);
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid Credentials');
    });
  });
});