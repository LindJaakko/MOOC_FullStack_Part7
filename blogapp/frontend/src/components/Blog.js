import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, username, onLike, onRemove }) => {
  const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const showWhenSameUser = {
    display: username === blog.user.username ? '' : 'none',
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <br></br>
        {blog.url}
        <br></br>
        {blog.likes}
        <button onClick={onLike}>like</button>
        <br></br>
        {blog?.user?.name}
        <div style={showWhenSameUser}>
          <button name='remove' onClick={onRemove}>
            remove
          </button>
          <br></br>
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  onLike: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  blog: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
}

export default Blog
