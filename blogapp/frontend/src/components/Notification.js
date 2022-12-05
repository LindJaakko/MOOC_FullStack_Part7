const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  if (type === 'notification') {
    return <div className='notification'>{message}</div>
  }
  return <div className='error'>{message}</div>
}

export default Notification
