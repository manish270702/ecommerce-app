import { configureStore } from '@reduxjs/toolkit'
import User from "./reducers/User.Slice"
import Token from "./reducers/Token.Slice"

export const store = configureStore({
  reducer: {
    user:User,
    token:Token
  },
})