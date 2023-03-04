import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { voteBlog } from '../reducers/blogReducer'
import { getAll, create } from '../services/comments'
import { Form, Button, Table } from 'react-bootstrap'

const Blog = ({ blogs }) => {
  const [newComment, setnewComment] = useState('')
  const [comments, setComments] = useState([])
  const dispatch = useDispatch()

  const id = useParams().id
  const blog = blogs.find((n) => n.id === id)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await getAll(id)
        setComments(comments)
      } catch (error) {
        console.log(error)
      }
    }
    fetchComments()
  }, [])

  if (!blog) {
    return null
  }

  const onLike = async () => {
    try {
      dispatch(voteBlog(blog))
    } catch {
      console.log('error')
    }
  }

  const handleCommentChange = (event) => {
    setnewComment(event.target.value)
  }

  const addComment = async (event) => {
    event.preventDefault()
    try {
      const comment = await create(id, { content: newComment })
      setComments(comments.concat(comment))
    } catch {
      console.log('error')
    }
    setnewComment('')
  }

  return (
    <div>
      <h1>
        {blog.title} {blog.author}
      </h1>
      <div>
        <a href='url'>{blog.url}</a>
        <div>
          {blog.likes} likes
          <Button onClick={onLike}>like</Button>
          <p>{`added by ${blog.user.name}`}</p>
        </div>
        <h2>comments</h2>
        <Form onSubmit={addComment}>
          <Form.Group>
            <Form.Control
              type='text'
              value={newComment}
              name='title'
              id='title'
              onChange={handleCommentChange}
            />
            <Button id='submit' type='submit'>
              add comment
            </Button>
          </Form.Group>
        </Form>
        <Table bordered>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id}>
                <td>{comment.content}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default Blog
