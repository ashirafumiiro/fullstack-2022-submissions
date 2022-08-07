const listHelper = require('../utils/list_helper');
const { blogs, listWithOneBlog } = require('./testData')

describe('most likes', () => {

  test('of one blog returns likes of that blog and auther', () => {
    const expected = {author: listWithOneBlog[0].author, likes: listWithOneBlog[0].likes};
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual(expected)
  });

  test('of empty list returns null', () => {
    expect(listHelper.mostLikes([])).toEqual(null)
  })

  test('of a bigger list returns the right one.', () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({author: 'Edsger W. Dijkstra', likes: 17})
  });

})