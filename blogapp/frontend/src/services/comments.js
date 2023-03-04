import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

const getAll = async (id) => {
  const request = axios.get(`${baseUrl}/${id}/comments`)
  const response = await request
  return response.data
}

const create = async (id, blogComment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, blogComment)
  return response.data
}

export { getAll, create }
