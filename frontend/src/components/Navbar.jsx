import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Ecommerce App
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/register">Register</Link>
          <Link to="/">Login</Link>
          <Link to="/update-profile">Update Profile</Link>
          <Link to="/update-address">Update Address</Link>
          <Link to="/create-product">Create Product</Link>
          <Link to="/create-category">Create Category</Link>
          <Link to="/cart">Cart</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4">
          <Link to="/register" onClick={() => setOpen(false)}>
            Register
          </Link>
          <Link to="/" onClick={() => setOpen(false)}>
            Login
          </Link>
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