import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    mountCart: (state, action) => {
      state.value = action.payload
    },
    clearcart:(state)=>{
      state.value=[]
    }
  },
})

// Action creators are generated for each case reducer function
export const { mountCart,clearcart } = cartSlice.actions

export default cartSlice.reducer