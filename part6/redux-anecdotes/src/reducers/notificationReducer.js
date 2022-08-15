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
export default notificationSlice.reducer
