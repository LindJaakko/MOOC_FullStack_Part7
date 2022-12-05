import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('blog form function', () => {
  test('event handler is called with correct details', async () => {
    const createBlog = jest.fn()
    const { container } = render(<BlogForm createBlog={createBlog} />)

    const titleInput = container.querySelector(`input[name="title"]`)
    const authorInput = container.querySelector(`input[name="author"]`)
    const urlInput = container.querySelector(`input[name="url"]`)

    const createButton = screen.getByText('create')

    await userEvent.type(titleInput, 'TestTitle')
    await userEvent.type(authorInput, 'TestAuthor')
    await userEvent.type(urlInput, 'TestUrl')

    await userEvent.click(createButton)
    expect(createBlog.mock.calls).toHaveLength(1)
    const blog = { title: 'TestTitle', author: 'TestAuthor', url: 'TestUrl' }
    expect(createBlog.mock.calls[0][0]).toStrictEqual(blog)
  })
})
