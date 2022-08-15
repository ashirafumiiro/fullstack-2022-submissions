import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {clearMessage, setMesssage} from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import Filter from './components/Filter'



const App = () => {
  const dispatch = useDispatch()
  const showNotification = (message) =>{
    dispatch(setMesssage(message))
    setTimeout(()=>dispatch(clearMessage()), 5000)
  }

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