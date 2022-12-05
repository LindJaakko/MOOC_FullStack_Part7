import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'TestTitle',
  author: 'TestAuthor',
  url: 'www.Test.fi',
  user: {
    username: 'TestUser',
    ref: 'User',
  },
  likes: 10,
}
const username = 'TestUser'

describe('renders content', () => {
  beforeEach(() => {
    const mockHandler = jest.fn()
    render(
      <Blog
        blog={blog}
        username={username}
        onLike={mockHandler}
        onRemove={mockHandler}
      />
    )
  })

  test('renders its title and author', async () => {
    const element = screen.getByText('TestTitle TestAuthor')
    expect(element).toBeDefined()
  })

  test('url is not rendered', async () => {
    const element = screen.queryByText('www.Test.fi')
    expect(element).not.toBeInTheDocument()
  })

  test('likes are not rendered', async () => {
    const element = screen.queryByText(10)
    expect(element).not.toBeInTheDocument()
  })

  test('url is shown after clicking the view button', async () => {
    const button = screen.getByText('view')
    userEvent.click(button)

    const element = screen.queryByText('www.Test.fi')
    expect(element).toBeDefined()
  })

  test('likes are shown after clicking the view button', async () => {
    const button = screen.getByText('view')
    userEvent.click(button)

    const element = screen.queryByText(10)
    expect(element).not.toBeInTheDocument()
  })
})

describe('handle clicks', () => {
  test('event handler is called twice when like button is clicked twice', async () => {
    const mockOnLike = jest.fn()
    const mockOnRemove = jest.fn()
    render(
      <Blog
        blog={blog}
        username={username}
        onLike={mockOnLike}
        onRemove={mockOnRemove}
      />
    )

    const viewButton = screen.getByText('view')
    userEvent.click(viewButton)

    const likeButton = screen.getByText('like')
    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(mockOnLike.mock.calls).toHaveLength(2)
  })
})
