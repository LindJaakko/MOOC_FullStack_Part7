var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sum = blogs.reduce((accumulator, object) => {
    return accumulator + object.likes
  }, 0)
  return sum
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((max, blog) =>
    max.likes > blog.likes ? max : blog
  )
  return (({ title, author, likes }) => ({ title, author, likes }))(favorite)
}

const mostBlogs = (blogs) => {
  const authors = _.chain(blogs)
    .groupBy('author')
    .map((value, key) => ({ author: key, blogs: _.size(value) }))
    .value()
  const favorite = authors.reduce((max, author) =>
    max.blogs > author.blogs ? max : author
  )
  return favorite
}

const mostLikes = (blogs) => {
  const authors = _(blogs)
    .groupBy('author')
    .map((objs, key) => ({
      author: key,
      likes: _.sumBy(objs, 'likes'),
    }))
    .value()

  const favorite = authors.reduce((max, author) =>
    max.likes > author.likes ? max : author
  )
  return favorite
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
