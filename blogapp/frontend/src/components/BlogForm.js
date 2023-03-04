import { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
    const value = event.target.value
    setNewBlog({
      ...newBlog,
      [event.target.name]: value,
    })
  }

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    })

    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>create new</h2>

      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            type='text'
            value={newBlog.title}
            name='title'
            id='title'
            onChange={handleBlogChange}
          />
          <Form.Label>author:</Form.Label>
          <Form.Control
            type='text'
            value={newBlog.author}
            name='author'
            id='author'
            onChange={handleBlogChange}
          />
          <Form.Label>url:</Form.Label>

          <Form.Control
            type='text'
            value={newBlog.url}
            name='url'
            id='url'
            onChange={handleBlogChange}
          />
          <Button variant='primary' type='submit'>
            create
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}
BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}
export default BlogForm
