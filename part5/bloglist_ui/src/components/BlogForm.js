import { useState } from 'react'

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
        title: <input value={title} onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>author: <input value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
      <div>url: <input value={url} onChange={({ target }) => setUrl(target.value)} /></div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
  )
}

export default BlogForm;