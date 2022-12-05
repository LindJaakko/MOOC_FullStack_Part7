const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  if (body.title === undefined && body.url === undefined) {
    response.status(400).end()
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id,
  })
  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  const updatedBlogWithUser = {
    ...result._doc,
    user: { _id: user._id, username: user.username, name: user.name },
    id: result._doc._id,
  }
  console.log(updatedBlogWithUser)
  response.status(201).json(updatedBlogWithUser)
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if (!blog) {
      return response.status(404).json({ error: 'Blog already deleted' })
    }

    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      return response
        .status(401)
        .json({ error: 'Only the creator of the blog can remove it' })
    }
  }
)

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const user = body.user
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  }
  const result = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  const updatedBlogWithUser = {
    ...result._doc,
    user: { _id: user._id, username: user.username, name: user.name },
    id: result._doc._id,
  }
  response.status(201).json(updatedBlogWithUser)
})

module.exports = blogsRouter
