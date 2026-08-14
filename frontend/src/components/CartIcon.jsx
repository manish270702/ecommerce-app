import React from 'react'
import { useSelector } from 'react-redux'
import {Link} from 'react-router-dom'

function CartIcon() {
  const cart = useSelector((state) => state.cart.value)
  return (
    <Link to="/cart" className="absolute bottom-12 right-12 text-lg cursor-pointer flex gap-2">
      Cart <span className="text-xl">→</span>
    </Link>
  )
}

export default CartIcon