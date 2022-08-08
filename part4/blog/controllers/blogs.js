const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken')
const { userExtractor, tokenExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  if(!updatedBlog) return response.status(404).end()
  
  response.json(updatedBlog)  
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const newBlog = {
    ...body,
    user: user._id
  }
  const blog = new Blog(newBlog)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {

  const blogToRemove = await Blog.findById(request.params.id);
  if(!blogToRemove) return response.status(404).end();
  if(blogToRemove.user.toString() !== request.user._id.toString())
    return response.status(403).json({error: 'you are not authorized to delete blog'});
  const res = await Blog.findByIdAndRemove(request.params.id)

  response.status(204).end()
})


module.exports = blogsRouter;