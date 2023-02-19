import { useState, useEffect } from 'react'
import userService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])
  const sortedUsers = [...users].sort((a, b) => b.blogs.length - a.blogs.length)

  useEffect(() => {
    const fetchData = async () => {
      const users = await userService.getAll()
      setUsers(users)
    }
    fetchData()
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {sortedUsers.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
