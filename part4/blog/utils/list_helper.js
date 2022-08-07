var _ = require('lodash');

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
}

const favoriteBlog = (blogs) =>{
  var sorted = [...blogs].sort((a,b) => b.likes - a.likes);
  return sorted.length === 0 ? null : sorted[0]
}

const mostBlogs = (blogs) => {
  if(!blogs || blogs.length === 0) return null;
  let groups = _.groupBy(blogs, x => x.author);
  let results = _.mapValues(groups, x => x.length)
  let top_author = Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b);

  return {author: top_author, blogs: results[top_author]}
}

const mostLikes = (blogs) => {
  if(!blogs || blogs.length === 0) return null;
  let groups = _.groupBy(blogs, x => x.author);
  let results = _.mapValues(groups, x => x.reduce((sum, item) => sum + item.likes, 0))
  let top_likes_author = Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b);

  return {author: top_likes_author, likes: results[top_likes_author]}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}