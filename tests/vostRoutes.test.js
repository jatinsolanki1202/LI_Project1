const app = require('../index.js');
const request = require('supertest');
const mongoose = require('mongoose')

// Create post
describe('post tests', () => {
  test('all data filled', async () => {
    const response = await request(app).post("/user/post").send({
      content: "hello first post"
    })
    expect(response.statusCode).toBe(302)
  })

})