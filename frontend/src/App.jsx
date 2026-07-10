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
const App = () => {

  const dispatch = useDispatch()

  //refresh token ko call karna h
  async function getToken() {
    const res = await axios.get("http://localhost:3000/api/auth/refreshToken",{
      withCredentials: true
    })
    dispatch(mountUser(res.data.user))

  }

  useEffect(() => {
    getToken()
  }, [])

  return (

    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/update-profile" element={<UpdateForm />} />
      <Route path="/update-address" element={<AddressUpdateForm />} />
      <Route path="/create-product" element={<CreateProduct />} />
      <Route path="/create-category" element={<CreateCategory />} />
    </Routes>
  )
}

export default App