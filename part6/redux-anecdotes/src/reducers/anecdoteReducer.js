import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from "../services/anecdotes"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(n => n.id === id)
      const changedAnecdote = { 
        ...anecdoteToChange, 
        votes: anecdoteToChange.votes + 1
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote 
      )
    },
    setAnecdotes(state, action){
      return action.payload
    },
    appendAnecdote(state, action){
      state.push(action.payload)
    },
    replaceAnecdote(state, action){
      return state.map(anecdote =>
        anecdote.id !== action.payload.id ? anecdote : action.payload 
      ) 
    }
  },
})



export const { setAnecdotes, appendAnecdote, replaceAnecdote} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const  addVote = anecdoteToChange => {
  const changedAnecdote = { 
    ...anecdoteToChange, 
    votes: anecdoteToChange.votes + 1
  }

  return async dispatch => {
    const updated = await anecdoteService.update(changedAnecdote.id, changedAnecdote)
    dispatch(replaceAnecdote(updated))
  }
}

export default anecdoteSlice.reducer