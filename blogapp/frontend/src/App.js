import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, voteBlog } from './reducers/blogReducer'
import { initializeUser, removeUser } from './reducers/userReducer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Menu from './components/Menu'
import Users from './views/Users'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(initializeUser(user))
    }
  }, [dispatch])

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      dispatch(initializeUser(user))
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(
        setNotification(
          { message: 'wrong username or password', type: 'alert' },
          3
        )
      )
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
    dispatch(
      setNotification(
        {
          message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
          type: 'info',
        },
        3
      )
    )
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(removeUser())
  }

  const onLike = async (blog) => {
    try {
      dispatch(voteBlog(blog))
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
          <Notification />
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
          <Router>
            <Notification />
            <div>
              <Menu />
              {user.name} logged in <button onClick={logOut}>logout</button>
            </div>
            <h2>blog app</h2>
            <Routes>
              <Route
                path='/'
                element={
                  <Togglable buttonLabel='new blog' ref={blogFormRef}>
                    <BlogForm createBlog={addBlog} />
                  </Togglable>
                }
              />
              <Route
                path='/'
                element={[...blogs]
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
              />
              <Route path='/users' element={<Users />} />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  )
}

export default App
