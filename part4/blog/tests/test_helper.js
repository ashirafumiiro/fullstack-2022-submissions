const Blog = require('../models/blog')
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  }
]

const initialUsers = [
  {
    username: "mluukkai",
    name: "Matti Luukkainen",
    password: "salainen"
  },
  {
    username: "hellas",
    name: "Arto Hellas",
    password: "salainen"
  }
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon", author: "Ashirafu Miiro",
    url: "https://willremovethissoon.com/",
    likes: 7
  });

  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, initialUsers, usersInDb
}