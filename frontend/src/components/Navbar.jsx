import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Dark } from "../store/reducers/Dark.Slice";

function Navbar() {
  const [open, setOpen] = useState(false);
  const role = useSelector((state) => state.user.value.role)

  const dark = useSelector((state) => state.Dark.value)

  const dispatch = useDispatch()
  const changeTheme = () => {
    dispatch(Dark(!dark))
  }

  const cart = useSelector((state) => state.cart.value)

  useEffect(() => {
    console.log(dark)
  }, [changeTheme])

  return (
    <nav className={`${dark ? "bg-zinc-950 text-zinc-50" : "bg-white text-black"} shadow-md`}>
      <div className=" flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-xl  font-bold">
          E-commerce App
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* <Link to="/register">Register</Link>
          <Link to="/">Login</Link> */}
          {role === "admin" && <>
            <Link to="/update-profile">Update Profile</Link>
            <Link to="/update-address">Update Address</Link>
            <Link to="/create-product">Create Product</Link>
            <Link to="/create-category">Create Category</Link>
            <Link to="/orders">Orders</Link>
          </>
          }
          {/* <Link to="/cart" className= "relative">Cart
          {cart && cart?.length===0?null:<span className="absolute top-0 -right-4 bg-red-600 rounded-full w-4 h-4 text-xs flex items-center justify-center">{cart.length}</span>}
          </Link> */}

          <Link to="/cart" className="relative">
            Cart

            {cart?.length > 0 && (
              <span className="absolute top-0 -right-4 bg-red-600 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          <button className="cursor-pointer" onClick={() => changeTheme()} >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden text-2xl flex gap-2">
          <button className="cursor-pointer" onClick={() => changeTheme()} >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
          <button

            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4">
          {/* <Link to="/register" onClick={() => setOpen(false)}>
            Register
          </Link>
          <Link to="/" onClick={() => setOpen(false)}>
            Login
          </Link> */}
          <Link to="/update-profile" onClick={() => setOpen(false)}>
            Update Profile
          </Link>
          <Link to="/update-address" onClick={() => setOpen(false)}>
            Update Address
          </Link>
          <Link to="/create-product" onClick={() => setOpen(false)}>
            Create Product
          </Link>
          <Link to="/create-category" onClick={() => setOpen(false)}>
            Create Category
          </Link>
          <Link to="/cart" onClick={() => setOpen(false)}>
            Cart
          </Link>
        </div>
      )}

    </nav>
  );
}

export default Navbar;