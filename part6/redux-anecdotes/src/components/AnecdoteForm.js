import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = (props) => {

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    props.createAnecdote(content)
    props.showNotification(`Added ${content}`)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name='anecdote' /></div>
        <button>create</button>
      </form>
    </div>
  )

}


const ConnectedAnecdoteForm = connect(null, {createAnecdote})(AnecdoteForm)
export default ConnectedAnecdoteForm