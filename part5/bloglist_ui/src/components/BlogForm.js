import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')

  const handleAddBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')

  }

  return (
    <form onSubmit={handleAddBlog}>
      <div>
        title: <input value={title} onChange={({ target }) => setTitle(target.value)} id='title'/>
      </div>
      <div>author: <input value={author} onChange={({ target }) => setAuthor(target.value)} id='author'/></div>
      <div>url: <input value={url} onChange={({ target }) => setUrl(target.value)} id='url'/></div>
      <div>
        <button type="submit" id='submit-button'>create</button>
      </div>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm