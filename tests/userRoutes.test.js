const app = require('../index.js');
const request = require('supertest');
const mongoose = require('mongoose')

// Register tests
describe('user register tests', () => {
  test('missing data', async () => {
    const response = await request(app).post("/user/register").send({
      fname: "hello",
      lname: "world",
      email: "hello@gmail.com",
      password: "ss",
      cnfPassword: "ss",
      gender: "male"
    })
    expect(response.statusCode).toBe(302)
  })

  test('invalid pass and cnfPass', async () => {
    const response = await request(app).post("/user/register").send({
      fname: "hello",
      lname: "world",
      email: "hello@gmail.com",
      password: "ss",
      cnfPassword: "1",
      gender: "male"
    })
    expect(response.statusCode).toBe(400)
  })

  test('all correct data passed', async () => {
    const response = await request(app).post("/user/register").send({
      fname: "hello",
      lname: "world",
      email: "hello@gmail.com",
      password: "ss",
      cnfPassword: "ss",
      gender: "male"
    })
    expect(response.statusCode).toBe(200)
  })

  test('passed email which already exists', async () => {
    const response = await request(app).post("/user/register").send({
      fname: "hello",
      lname: "world",
      email: "hello@gmail.com",
      password: "ss",
      cnfPassword: "1",
      gender: "male"
    })
    expect(response.statusCode).toBe(400)
  })
})

// Login tests
describe('user login tests', () => {
  test('missing data', async () => {
    const response = await request(app).post("/user/login").send({
      email: "hello@gmail.com",
      // password: "ss",
    })
    expect(response.statusCode).toBe(400)
  })

  test('invalid email passed', async () => {
    const response = await request(app).post("/user/login").send({
      email: "test@test.com",
      password: "ss",
    })
    expect(response.statusCode).toBe(400)
  })

  test('invalid password passed', async () => {
    const response = await request(app).post("/user/login").send({
      email: "hello@gmail.com",
      password: "s1",
    })
    expect(response.statusCode).toBe(400)
  })

  test('all data passed correctly', async () => {
    const response = await request(app).post("/user/login").send({
      email: "hello@gmail.com",
      password: "ss",
    })
    expect(response.statusCode).toBe(302)
  })
})