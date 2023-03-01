import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { voteBlog } from '../reducers/blogReducer'

const Blog = ({ blogs }) => {
  const dispatch = useDispatch()

  const id = useParams().id
  const blog = blogs.find((n) => n.id === id)

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

  return (
    <div>
      <h1>
        {blog.title} {blog.author}
      </h1>
      <div>
        <a href='url'>{blog.url}</a>
        <div>
          {blog.likes} likes
          <button onClick={onLike}>like</button>
          <p>{`added by ${blog.user.name}`}</p>
        </div>
      </div>
    </div>
  )
}

export default Blog
