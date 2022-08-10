import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message) => {
    setNotificationMessage( message )
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('wrong username or password')
    }
  }

  const handleAddBlog = (blogObject) => {

    blogService.create(blogObject)
      .then(returnedBlog => {
        showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setBlogs(blogs.concat(returnedBlog))
        blogFormRef.current.toggleVisibility()
      }).catch(error => {
        showNotification(error.response.data.error)
        console.log(error.response)
      })

  }

  const addLike = id => {
    const blog = blogs.find(b => b.id === id)
    const likes = blog.likes || 0

    const changedBlog = { ...blog, likes: likes + 1, user: blog.user.id }
    delete changedBlog.id

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(error => {
        console.log(error)
        showNotification(
          `Blog '${blog.content}' was already removed from server`
        )
        setBlogs(blogs.filter(n => n.id !== id))
      })
  }

  const deletBlog = id => {
    const blog = blogs.filter(p => p.id === id)[0]
    console.log('Deleting for blog:', blog)
    if (window.confirm(`Remove ${blog.title} by ${blog.author}!`)) {

      blogService.deleteBlog(id)
        .then(() => {
          showNotification(`deleted '${blog.title}'`)
          setBlogs(blogs.filter(blog => blog.id !== id))
        })
    }
  }



  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>log in to application</h1>
      <Notification message={notificationMessage} />
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const sortedBlogs = [...blogs].sort((a,b) => b.likes - a.likes)
  const blogsUI = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} />
      <p>{user.name} logged in <button onClick={() => { setUser(null); window.localStorage.clear() }}>log out</button></p>
      <h2>create new</h2>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleAddBlog}
        />
      </Togglable>

      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} addLike={() => addLike(blog.id)}
          deletable={user.username && user.username === blog.user.username}
          handleDelete={() => deletBlog(blog.id)}/>
      )}
    </div>
  )

  return (
    <div>
      {user === null ? loginForm() : blogsUI()}
    </div>
  )
}

export default App
