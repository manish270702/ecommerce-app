import React from 'react'
import {Link} from 'react-router-dom'
function Navbar() {
  return (
    <div className="flex justify-between items-center p-4">
        <Link to="/">Ecommerce App</Link>
        <div className="flex gap-4 ">
            <Link to="/register">Register</Link>
            <Link to="/">Login</Link>
            <Link to="/update-profile">Update Profile</Link>
            <Link to="/update-address">Update Address</Link>
            <Link to="/create-product">Create Product</Link>
            <Link to="/create-category">Create Category</Link>
            <Link to="/cart">Cart</Link>

        </div>
    </div>
  )
}

export default Navbar