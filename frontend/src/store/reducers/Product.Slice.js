import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    mountProducts: (state, action) => {
      const incoming = Array.isArray(action.payload)
        ? action.payload
        : [action.payload]

      incoming.forEach((product) => {
        const exists = state.value.some(
          (existing) => existing._id === product._id
        )

        if (!exists) {
          state.value.push(product)
        }
      })
    },
  },
})

// Action creators are generated for each case reducer function
export const { mountProducts } = productSlice.actions

export default productSlice.reducer