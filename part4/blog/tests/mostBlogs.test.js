const listHelper = require('../utils/list_helper')
const {blogs, listWithOneBlog} = require('./testData')

describe('most blogs', () => {

  test('of empty list returns null', () => {
    expect(listHelper.mostBlogs([])).toBe(null)
  })

  test('when list has only one blog, equals the quthor of that blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({author: 'Edsger W. Dijkstra', blogs: 1})
  })

  test('of a bigger list is returns the right value', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({author: 'Robert C. Martin', blogs: 3})
  })  
})