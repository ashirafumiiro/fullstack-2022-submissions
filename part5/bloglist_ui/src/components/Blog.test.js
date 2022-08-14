import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  const blog = {
    title: 'The test blog',
    author: 'Ashirafu',
    likes: 4,
    user: {
      name: 'Alex'
    }
  }
  let container
  const addLike = jest.fn()
  beforeEach(() => {
    container = render(<Blog blog={blog}  addLike={addLike}/>).container
  })

  test('blog renders title and author by default but not other details', () => {
    //tittle and author rendered
    const element = screen.getByText(`${blog.title} ${blog.author}`)
    const otherDetails = container.querySelector('.other-details')
    expect(otherDetails).toHaveStyle('display: none')

    expect(element).toBeDefined()
    expect(otherDetails).toBeDefined()
  })

  test('after clicking the button, url and number of likes are shown', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const div = container.querySelector('.other-details')
    expect(div).not.toHaveStyle('display: none')
  })

  test('clicking like twice calls handler twice', async () => {
    const user = userEvent.setup()

    const showButton = screen.getByText('show')
    await user.click(showButton)

    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(addLike.mock.calls).toHaveLength(2)
  })
})