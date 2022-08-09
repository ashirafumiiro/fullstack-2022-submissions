import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification';


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message) =>{
    setNotificationMessage( message )
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000);
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

  const handleAddBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url,
    }

    blogService.create(blogObject)
      .then(returnedBlog => {
        showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setBlogs(blogs.concat(returnedBlog));
        setTitle('');
        setAuthor('');
        setUrl('');
      }).catch(error => {
        showNotification(error.response.data.error)
        console.log(error.response)
      });

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

  const blogsUI = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} />
      <p>{user.name} logged in <button onClick={() => { setUser(null); window.localStorage.clear() }}>log out</button></p>
      <h2>create new</h2>
      <BlogForm handleSubmit={handleAddBlog}
        newTitle={title} titleChange={({ target }) => setTitle(target.value)}
        author={author} authorChange={({ target }) => setAuthor(target.value)}
        url={url} urlChange={({ target }) => setUrl(target.value)}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  );

  return (
    <div>
      {user == null ? loginForm() : blogsUI()}
    </div>
  )
}

export default App
