import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { mountCart } from '../store/reducers/Cart.Slice'
import { Link } from 'react-router-dom'

function Product({ product, addTocart, cartItem }) {

  const dispatch = useDispatch()

  const dark = useSelector((state) => state.Dark.value)

  const token = useSelector((state) => state.token?.value)

  // cartItem can be undefined when product is NOT in cart
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const debounceRef = useRef(null)

  // Calculate discounted price
  const discountedPrice = product.discountPercentage
    ? (
      product.price *
      (1 - product.discountPercentage / 100)
    ).toFixed(2)
    : product.price

  const handleQuantityChange = (e) => {

    const newQuantity = parseInt(e.target.value) || 1

    // Check stock
    if (newQuantity > product.stock) {
      setError(`Only ${product.stock} items available`)
      setQuantity(product.stock)
      return
    }

    if (newQuantity < 1) {
      setError('Quantity must be at least 1')
      setQuantity(1)
      return
    }

    setError('')
    setQuantity(newQuantity)

    // Clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Wait 800ms before API call
    debounceRef.current = setTimeout(() => {
      updateCart(product._id || product.id, newQuantity)
    }, 800)
  }

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [dark])

  const updateCart = async (productId, newQuantity) => {

    try {

      setLoading(true)
      setError('')

      // Validate quantity
      if (newQuantity > product.stock) {
        setError(`Only ${product.stock} items available in stock`)
        setQuantity(product.stock)
        return
      }

      if (newQuantity < 1) {
        setError('Quantity must be at least 1')
        setQuantity(1)
        return
      }

      const res = await axios.post(
        'http://localhost:3001/api/cart/',
        {
          productid: productId,
          quantity: newQuantity,
          price: product.price,
          stock: product.stock
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // Update Redux cart
      dispatch(mountCart(res.data.item.items))

      setQuantity(newQuantity)

    } catch (err) {

      console.error(err)

      setError(
        err.response?.data?.message ||
        'Failed to update cart'
      )

      // Restore previous quantity
      setQuantity(cartItem?.quantity || 1)

    } finally {

      setLoading(false)

    }
  }

  const handleAddToCart = async () => {

    if (product.stock === 0) {
      return
    }

    if (quantity > product.stock) {
      setError(`Only ${product.stock} items available`)
      return
    }

    setLoading(true)

    try {

      await addTocart(
        product,
        quantity,
        discountedPrice
      )

      setError('')

    } catch (err) {

      console.error(err)

      setError(
        err.response?.data?.message ||
        'Failed to add to cart'
      )

    } finally {

      setLoading(false)

    }
  }



  const stockStatus =
    product.stock === 0
      ? 'Out of Stock'
      : `${product.stock} in stock`

  const stockClass =
    product.stock === 0
      ? 'text-red-600'
      : product.stock <= 5
        ? 'text-orange-600'
        : 'text-green-600'


  return (
    <div  className={`${dark ? "border border-gray-600 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full" : "border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"}`}>
      <Link to={`/products/${product._id}`}>

        {/* Image */}
        <div className={`relative h-48 ${dark ? "bg-zinc-800 text-white" : "bg-gray-100"} overflow-hidden flex items-center justify-center`}>

          <img
            src={product?.images?.[0] || ""}
            alt={product.title}
            className="h-full w-full object-cover hover:scale-105 transition-transform"
          />

          {product.discountPercentage && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{product.discountPercentage}%
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                Out of Stock
              </span>
            </div>
          )}

        </div>


        {/* Content */}
        <div className="p-4 flex flex-col">

          {/* Title */}
          <h2 className={`${dark ? "text-lg font-semibold text-white mb-2 line-clamp-2" : "text-lg font-semibold text-gray-900 mb-2 line-clamp-2"}`}>
            {product.title}
          </h2>

          {/* Description */}
          <p className={`${dark ? "text-gray-400 text-sm mb-3 line-clamp-2" : "text-gray-600 text-sm mb-3 line-clamp-2"}`}>
            {product.description}
          </p>

          {/* Brand */}
          {product.brand && (
            <p className={`${dark ? "text-xs text-gray-400 mb-3" : "text-xs text-gray-500 mb-3"}`}>
              Brand:{' '}
              <span className="font-medium">
                {product.brand}
              </span>
            </p>
          )}

          {/* Stock */}
          {/* <p className={`text-sm font-medium mb-3 ${stockClass}`}>
          {stockStatus}
        </p> */}


          {/* Price */}
          <div className={`${dark ? " pb-4 border-b border-gray-600 text-white" : "mb-4 pb-4 border-b border-gray-200"}`}>

            <div className="flex items-baseline gap-2">

              <span className={`${dark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}`}>
                ${discountedPrice}
              </span>

              {product.discountPercentage && (
                <span className="text-sm text-gray-500 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>
              )}

            </div>

          </div>


          {/* Cart */}

        </div>
      </Link>
      {cartItem ? (

        <div className="space-y-2 mx-4 mb-4">

          <div className={`${dark ? "bg-zinc-900 border border-zinc-600" : "bg-green-50 border border-green-200"} rounded-lg px-2 py-1`}>

            <div className="flex justify-end items-center">

              <div className="flex items-center gap-3">

                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={product.stock === 0 || loading}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

              </div>

            </div>


            {error && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

          </div>

        </div>

      ) : (

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || loading}
          className=" bg-blue-600 mx-4 mb-4 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Adding...'
            : product.stock === 0
              ? 'Out of Stock'
              : 'Add to Cart'
          }
        </button>

      )}

    </div>
  )
}

export default Product