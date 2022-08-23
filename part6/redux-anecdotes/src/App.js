import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {setNotification} from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import Filter from './components/Filter'
import { useEffect } from 'react'
import {initializeAnecdotes} from './reducers/anecdoteReducer'



const App = () => {
  const dispatch = useDispatch()
  const showNotification = (message) =>{
    dispatch(setNotification(message, 5))
  }

  useEffect(() =>{
    dispatch(initializeAnecdotes())
  }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList showNotification={showNotification}/>
      <AnecdoteForm showNotification={showNotification}/>
    </div>
  )
}

export default App