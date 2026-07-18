import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    mountProducts: (state,action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { mountProducts } = productSlice.actions

export default productSlice.reducer