const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({})
  console.log('cleared users');

  for (const user of helper.initialUsers) {
    let userObject = new User({username: user.username, passwordHash: user.password, name: user.name});
    await userObject.save();
  }

  // blogs are save for first user
  const user = await User.findOne({username: helper.initialUsers[0].username});
  console.log('User:', user)

  await Blog.deleteMany({})
  console.log('cleared')

  for (let blog of helper.initialBlogs) {
    blog.user = user._id.toString();
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

}, 1000000)


describe('retrieving blogs', () => {
  test('all blogs are returned in json', async () => {
    const response = await api.get('/api/blogs').expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('returned blogs have id property defined', async () => {
    const response = await api.get('/api/blogs').expect(200);

    expect(response.body[0].id).toBeDefined();
  });

})

describe('Adding a blog', () => {
  let token = '';
  beforeEach(async () =>{
    var user = helper.initialUsers[0];

    const authResult = await api
      .post('/api/login')
      .send({ username: user.username, password: user.password })
      .expect(200);
      token = authResult.body.token;
  })

  test('a valid blog can be added', async () => {
    
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    }
    //request.auth('my_token', { type: 'bearer' })
    var response = await api
      .post('/api/blogs')
      .auth(token,  { type: 'bearer' })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain('Canonical string reduction');
    let returnedBlog = response.body;
    delete returnedBlog.id;
    delete returnedBlog.user;
    expect(response.body).toEqual(newBlog);
  })

  test('missing likes defaults to 0', async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    }

    var response = await api
      .post('/api/blogs')
      .auth(token,  { type: 'bearer' })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(0)
  })

  test('missing title raises 400', async () => {
    const newBlog = {
      author: 'Mr Ashirafu',
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      like: 3
    }

    await api
      .post('/api/blogs')
      .auth(token,  { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })

  test('missing url raises 400', async () => {
    const newBlog = {
      title: "Migrating to mongodb",
      author: 'Mongo monkey',
      like: 3
    }

    await api
      .post('/api/blogs')
      .auth(token,  { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })

  test('missing a token raises 401', async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })


})

describe('deletion of a blog', () => {
  let token = '';
  beforeEach(async () =>{
    var user = helper.initialUsers[0];

    const authResult = await api
      .post('/api/login')
      .send({ username: user.username, password: user.password })
      .expect(200);
      token = authResult.body.token;
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(token,  { type: 'bearer' })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title);
  })

  test('raises 400 if id is mulformed', async () => {

    await api
      .delete(`/api/blogs/worong_id`)
      .auth(token,  { type: 'bearer' })
      .expect(400)
  })

  test('returns 404 for non existing id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    // delete first time.
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(token,  { type: 'bearer' })
      .expect(204)

    // delete second time.
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(token,  { type: 'bearer' })
      .expect(404)

  })

})

describe('updating a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newLikesValue = 23;
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: newLikesValue })
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const blogAfterUpdate = blogsAtEnd.find(blog => blog.id == blogToUpdate.id);

    expect(blogAfterUpdate.likes).toBe(newLikesValue);

  })

  test('fails with status code 400 if id is malformatted', async () => {
    const newLikesValue = 23;
    await api
      .put(`/api/blogs/bad_id`)
      .send({ likes: newLikesValue })
      .expect(400)
  })

  test('fails with 404 if blog does not exist', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    // deleting the blog
    await Blog.findByIdAndDelete(blogToUpdate.id);

    const newLikesValue = 23;
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: newLikesValue })
      .expect(404)

  })

})


afterAll(() => {
  mongoose.connection.close()
})