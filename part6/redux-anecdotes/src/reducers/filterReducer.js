import { createSlice } from '@reduxjs/toolkit'
const initialState = ''

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    filterChange(state, action) {
      const text = action.payload
      return text
    },
  },
})

export const { filterChange } = filterSlice.actions
export default filterSlice.reducer
