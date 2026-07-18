import { configureStore } from '@reduxjs/toolkit'
import User from "./reducers/User.Slice"
import Token from "./reducers/Token.Slice"
import Category from "./reducers/Category.Slice"
import Product from "./reducers/Product.Slice"

export const store = configureStore({
  reducer: {
    user:User,
    token:Token,
    category:Category,
    product:Product
  },
})