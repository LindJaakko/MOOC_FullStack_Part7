const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const newUser = {
    username: 'Test1',
    name: 'TestUser1',
    password: 'Secret1',
  }
  await api.post('/api/users').send(newUser)
  const response = await api.post('/api/login').send(newUser)
  token = response.body.token

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('correct amount of blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog ids are not undefined', async () => {
  const response = await api.get('/api/blogs')

  const ids = response.body.map((r) => r.id)
  ids.forEach((id) => expect(id).toBeDefined())
})

describe('adding of a blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Joku',
      url: 'www.test.fi',
      likes: 20,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((n) => n.title)
    expect(titles).toContain('Test blog')
  })

  test('blog without likes is defaulted to 0', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Joku',
      url: 'www.test.fi',
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer ' + token)
    expect(response.body.likes).toBe(0)
  })

  test('blog should have both title and url, otherwise 400 bad request', async () => {
    const newBlog = {
      author: 'Joku',
      likes: 20,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer ' + token)
      .expect(400)
  })

  test('if token is not provided, adding a blog fails with 401 unauthorized', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Joku',
      url: 'www.test.fi',
      likes: 20,
    }
    await api.post('/api/blogs').send(newBlog).expect(401)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Joku',
      url: 'www.test.fi',
      likes: 20,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((n) => n.title)
    expect(titles).toContain('Test blog')
  })
})

describe('update a blog in database', () => {
  test('succeeds with status code 201 if id is valid', async () => {
    const blogToUpdate = {
      id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 20,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    expect(blogsAtEnd).toContainEqual(blogToUpdate)
  })
})

describe('Adding of a user', () => {
  test('A valid user can be added', async () => {
    const newUser = {
      username: 'Test',
      name: 'TestUser',
      password: 'Secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map((n) => n.username)
    expect(usernames).toContain('Test')
  })

  test('Username already in database causes 400 bad request', async () => {
    const newUser = {
      username: 'Test',
      name: 'TestUser',
      password: 'Secret',
    }

    await api.post('/api/users').send(newUser)
    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('username must be unique')
  })

  test('Username should be more than 3 characters long, otherwise 400 bad request', async () => {
    const newUser = {
      username: 'OK',
      name: 'TestUser',
      password: 'Secret',
    }
    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain(
      'username and password must be at least 3 characters long'
    )
  })

  test('Password should be more than 3 characters long, otherwise 400 bad request', async () => {
    const newUser = {
      username: 'ValidUser',
      name: 'TestUser',
      password: 'OK',
    }
    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain(
      'username and password must be at least 3 characters long'
    )
  })
})

afterAll(() => {
  mongoose.connection.close()
})
