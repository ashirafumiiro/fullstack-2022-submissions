const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app);
const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({})
  console.log('cleared');
  await User.insertMany(helper.initialUsers)

}, 1000000)

describe('Adding a user', () => {
  test('a valid user can be added', async () => {
    const newUser = {
      username: "miiro",
      name: "Ashirafu Miiro",
      password: "salainen"
    }

    var response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)

    const usernames = usersAtEnd.map(r => r.username)
    expect(usernames).toContain(newUser.username);
  })

  test('missing username or password raises 400', async () => {
    // username missing
    let newUser = {
      name: "Ashirafu Miiro",
      password: "salainen"
    }

    var response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toBe('username must be 3 characters or more')

    // password missing
    newUser = {
      username: "miiro",
      name: "Ashirafu Miiro",
    }

    var response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toBe('password must be 3 characters or more')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })

  test('username and password have minimum length of 3', async () => {
    // username too short
    let newUser = {
      username: "mi",
      name: "Ashirafu Miiro",
      password: "salainen"
    }

    var response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toBe('username must be 3 characters or more')

    // password too short
    newUser = {
      username: "miiro",
      name: "Ashirafu Miiro",
      password: "pa"
    }

    var response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toBe('password must be 3 characters or more')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })

  test('username must be unique', async () => {
    // already added user
    const newUser = helper.initialUsers[0];

    var response = await api
      .post('/api/users')
      .send(newUser)
      .expect(409)
      
    // no user added
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)

    expect(response.body.error).toBe('username must be unique');
  })  

})

afterAll(() => {
  mongoose.connection.close()
})