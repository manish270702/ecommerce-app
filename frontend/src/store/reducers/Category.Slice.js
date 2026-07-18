import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    mountCategory: (state,action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { mountCategory } = categorySlice.actions

export default categorySlice.reducer