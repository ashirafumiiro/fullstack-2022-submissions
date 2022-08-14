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

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()
  
    const vote = (id) => {
      dispatch(addVote(id))
    }

    return(
        <div>
            {anecdotes.sort((a,b) => b.votes - a.votes).map(anecdote =>
            <Anecdote key={anecdote.id}
            anecdote={anecdote} 
            handleVote={() => vote(anecdote.id)} />
      )}
        </div>
    )

}

export default AnecdoteList