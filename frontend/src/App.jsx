import React from 'react'
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import UpdateForm from './components/UpdateForm'
import AddressUpdateForm from './components/AddressUpdateForm'
import CreateProduct from './components/CreateProduct'
import CreateCategory from './components/CreateCategory';
import { Routes, Route } from 'react-router-dom'
import axios from 'axios/unsafe/axios.js'
import { useEffect } from 'react'
import { mountUser } from './store/reducers/User.Slice'
import { useDispatch, useSelector } from 'react-redux'
import { mountToken } from './store/reducers/Token.Slice'
import Home from './pages/Home'
import { mountCategory } from './store/reducers/Category.Slice'
import Cart from './components/Cart'
import { mountCart } from './store/reducers/Cart.Slice'
const App = () => {

  
  const dispatch = useDispatch()
  
  //refresh token ko call karna h
  async function getToken() {
    const res = await axios.get("http://localhost:3000/api/auth/refreshToken", {
      withCredentials: true
    })
    dispatch(mountUser(res.data.user))
    dispatch(mountToken(res.data.accessToken))
  }

  const token = useSelector((state) => state.token.value)

  async function getCategory() {
    const res = await axios.get("http://localhost:3002/api/category/allCategory", {
      withCredentials: true
    })
    dispatch(mountCategory(res.data.unique_category))
  }

    const getCart = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/cart/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log(res.data.items[0].items);
        dispatch(mountCart(res.data.items[0].items));
      } catch (err) {
        console.log(err);
      }
    };

  useEffect(() => {
    getToken()
    getCategory()
  }, [])

  useEffect(() => {
      if (token) {
        getCart();
      }
    }, [token]);

  return (

    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/update-profile" element={<UpdateForm />} />
      <Route path="/update-address" element={<AddressUpdateForm />} />
      <Route path="/create-product" element={<CreateProduct />} />
      <Route path="/create-category" element={<CreateCategory />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  )
}

export default App