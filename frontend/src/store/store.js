import { configureStore } from '@reduxjs/toolkit'
import User from "./reducers/User.Slice"

export const store = configureStore({
  reducer: {
    user:User
  },
})