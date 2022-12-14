import { useState } from 'react'

const Blog = ({ blog, addLike, deletable, handleDelete }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }

  const toggleVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle} className='blog'>
      <div className='title-name'>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{detailsVisible ? 'hide' : 'show'}</button>
      </div>
      <div style={showWhenVisible} className="other-details">
        <div>{blog.url}</div>
        <div>likes {blog.likes || 0} <button onClick={addLike} className='like-button'>like</button></div>
        <div>{blog.user.name}</div>
        {deletable === true &&  <div><button onClick={handleDelete} className='delete-button'>delete</button></div>}
      </div>
    </div>
  )

}

export default Blog