import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'
const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>username</Form.Label>

          <Form.Control
            value={username}
            onChange={handleUsernameChange}
            id='username'
          />
          <Form.Label>password</Form.Label>
          <Form.Control
            type='password'
            value={password}
            onChange={handlePasswordChange}
            id='password'
          />
          <Button id='login-button' type='submit'>
            login
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}
LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}
export default LoginForm
