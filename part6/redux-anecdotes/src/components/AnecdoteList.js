import { addVote} from '../reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'

const Anecdote = ({anecdote, handleVote}) =>{
    return(
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={handleVote}>vote</button>
          </div>
        </div>
    )
}

const AnecdoteList = ({showNotification}) => {
    const anecdotes = useSelector(({anecdotes, filter}) => {
      if(filter) {
        return anecdotes.filter(an => an.content.toLowerCase().includes(filter.toLowerCase()))
      }
      return anecdotes
    })
    const dispatch = useDispatch()
    
  
    const vote = (id) => {
      const anecdote = anecdotes.find(a => a.id === id)
      dispatch(addVote(anecdote))
      showNotification(`you voted '${anecdote.content}'`)
    }
    const sortedAecdotes = [...anecdotes].sort((a,b) => b.votes - a.votes)
    return(
        <div>
            
            {sortedAecdotes.map(anecdote =>
            <Anecdote key={anecdote.id}
            anecdote={anecdote} 
            handleVote={() => vote(anecdote.id)} />
      )}
        </div>
    )

}

export default AnecdoteList