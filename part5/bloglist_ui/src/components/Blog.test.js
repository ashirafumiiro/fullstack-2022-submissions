import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
// import userEvent from '@testing-library/user-event'

test('blog renders title and author by default but not other details', () => {
  const blog = {
    title: 'The test blog',
    author: 'Ashirafu',
    likes: 4
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  screen.debug(element)
  expect(element).toBeDefined()
})