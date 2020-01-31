const request = require('supertest'); // calling it "request" is a common practice

const server = require('./server'); // this is our first red, file doesn't exist yet

const db = require('../database/dbConfig');

describe('server.js', () => {
  // http calls made with supertest return promises, we can use async/await if desired
  describe('index route', () => {
    it('should return an OK status code from the index route', async () => {
      const expectedStatusCode = 200;

      // do a get request to our api (server.js) and inspect the response
      const response = await request(server).get('/');

      expect(response.status).toEqual(expectedStatusCode);

      // same test using promise .then() instead of async/await
      // let response;
      // return request(server).get('/').then(res => {
      //   response = res;

      //   expect(response.status).toEqual(expectedStatusCode);
      // })
    });

    it('should return a JSON object from the index route', async () => {
      const expectedBody = { api: 'running' };

      const response = await request(server).get('/');

      expect(response.body).toEqual(expectedBody);
    });

    it('should return a JSON object from the index route', async () => {
      const response = await request(server).get('/');

      expect(response.type).toEqual('application/json');
    });
  });
});

describe('Register', () => {
    beforeEach(async () => {
        await db('users').truncate();
    })

    it('Should return 201 on creation', async () => {
        const response = await request(server)
            .post('/api/auth/register')
            .send({
                username: 'test',
                password: 'password'
            })
        expect(response.status).toBe(201)
    })

    it('Should send JSON', async () => {
        const response = await request(server)
            .post('/api/auth/register')
            .send({
                username: 'test',
                password: 'password'
            })
        expect(response.type).toMatch(/json/i);
    })
})

describe('Login', () => {
    it('Should let registered user log in', async () => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                username: 'test',
                password: 'password'
            })
        expect(response.status).toBe(200)
    })

    it('Should not log in with invalid credentials', async () => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                username: 'test',
                password: 'wrongpassword'
            })
        expect(response.status).toBe(401)
    })
})