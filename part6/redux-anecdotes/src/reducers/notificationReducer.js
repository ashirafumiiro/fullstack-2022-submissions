import { createSlice } from '@reduxjs/toolkit'
const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setMesssage(state, action) {
      const message = action.payload
      return message
    },
    clearMessage(state, action){
        return ''
    }
  },
})

export const { setMesssage, clearMessage } = notificationSlice.actions

let timeoutID;
export const setNotification = (message, seconds) => {
  return async dispatch => {
    if(timeoutID) clearTimeout(timeoutID);
    dispatch(setMesssage(message))
    timeoutID = setTimeout(()=>dispatch(clearMessage()), seconds*1000)
  }
}


export default notificationSlice.reducer
