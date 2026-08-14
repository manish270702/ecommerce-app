import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: localStorage.getItem("dark") || true,
}

export const darkSlice = createSlice({
  name: 'dark',
  initialState,
  reducers: {
    Dark: (state,action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { Dark } = darkSlice.actions

export default darkSlice.reducer