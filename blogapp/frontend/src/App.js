import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState('')

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setErrorType('error')
      setTimeout(() => {
        setErrorMessage(null)
        setErrorType('')
      }, 3000)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
    })

    setErrorMessage(
      `a new blog ${blogObject.title} by ${blogObject.author} added`
    )
    setErrorType('notification')
    setTimeout(() => {
      setErrorMessage(null)
      setErrorType('')
    }, 3000)
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const onLike = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    const { id } = blog
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs((currentBlogs) =>
        currentBlogs.map((blog) => (blog.id === id ? returnedBlog : blog))
      )
    } catch {
      console.log('error')
    }
  }

  const onRemove = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        await blogService.remove(blog.id)
        window.location.reload()
      }
    } catch {
      console.log('error')
    }
  }

  const blogFormRef = useRef()

  return (
    <div>
      {user === null ? (
        <div>
          <h2>log in to application</h2>
          <Notification message={errorMessage} type={errorType} />
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification message={errorMessage} type={errorType} />
          <p>
            {user.name} logged in <button onClick={logOut}>logout</button>
          </p>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                username={user.username}
                onLike={() => onLike(blog)}
                onRemove={() => onRemove(blog)}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
