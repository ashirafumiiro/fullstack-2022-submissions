const listHelper = require('../utils/list_helper');
const {blogs, listWithOneBlog} = require('./testData')

describe('favorite blog', () => {

  test('of one blog returns that', () => {
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0])
  });

  test('of empty list returns null', () => {
    expect(listHelper.favoriteBlog([])).toEqual(null)
  })

  test('of a bigger list returns the right one.', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(blogs[2])
  });

})