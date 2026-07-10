import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
    
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    mountUser: (state,action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { mountUser } = userSlice.actions

export default userSlice.reducer