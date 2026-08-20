import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const orderSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    mountOrder: (state, action) => {
      state.value = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { mountOrder } = orderSlice.actions

export default orderSlice.reducer