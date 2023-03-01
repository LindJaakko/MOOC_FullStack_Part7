import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog } from './reducers/blogReducer'
import { initializeUser, removeUser } from './reducers/userReducer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Menu from './components/Menu'
import Users from './views/Users'
import User from './components/User'

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
  const users = useSelector((state) => state.users)

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
                  <div>
                    <Togglable buttonLabel='new blog' ref={blogFormRef}>
                      <BlogForm createBlog={addBlog} />
                    </Togglable>
                    <BlogList blogs={blogs} />
                  </div>
                }
              />
              <Route path='/users' element={<Users />} />
              <Route path='/users/:id' element={<User users={users} />} />
              <Route path='/blogs/:id' element={<Blog blogs={blogs} />} />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  )
}
export default App
