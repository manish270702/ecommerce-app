import React, { useState } from 'react'

function Product({ product, addTocart, cartItem }) {
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1
    
    if (newQuantity > product.stock) {
      setError(`Only ${product.stock} items available`)
      setQuantity(product.stock)
      return
    }
    
    setError('')
    setQuantity(newQuantity)
  }

  const handleAddToCart = async () => {
    if (quantity > product.stock) {
      setError(`Only ${product.stock} items available`)
      return
    }

    setLoading(true)
    try {
      await addTocart(product, quantity,discountedPrice)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  const stockStatus = product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`
  const stockClass = product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-orange-600' : 'text-green-600'
  const discountedPrice = product.discountPercentage 
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price

  return (
    <div className='border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full'>
      {/* Image Container */}
      <div className='relative h-48 bg-gray-100 overflow-hidden flex items-center justify-center'>
        <img src={product?.images[0] || ""} alt={product.title} className='h-full w-full object-cover hover:scale-105 transition-transform' />
        {product.discountPercentage && (
          <div className='absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
            -{product.discountPercentage}%
          </div>
        )}
        {product.stock === 0 && (
          <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <span className='text-white text-lg font-bold'>Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className='p-4 flex flex-col'>
        {/* Title & Description */}
        <h2 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-2'>{product.title}</h2>
        <p className='text-gray-600 text-sm mb-3 line-clamp-2'>{product.description}</p>

        {/* Brand */}
        {product.brand && (
          <p className='text-xs text-gray-500 mb-3'>Brand: <span className='font-medium'>{product.brand}</span></p>
        )}

        {/* Stock Status */}
        <p className={`text-sm font-medium mb-3 ${stockClass}`}>{stockStatus}</p>

        {/* Price Section */}
        <div className='mb-4 pb-4 border-b border-gray-200'>
          <div className='flex items-baseline gap-2'>
            <span className='text-2xl font-bold text-gray-900'>${discountedPrice}</span>
            {product.discountPercentage && (
              <span className='text-sm text-gray-500 line-through'>${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Quantity Section */}
        <div className='mb-4'>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className='flex items-center gap-3'>
            <input
              type="number"
              id="quantity"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
              disabled={product.stock === 0}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm'>
            {error}
          </div>
        )}

        {/* Action Button */}
        {cartItem ? (
          <div className='space-y-2'>
            <div className='bg-green-50 border border-green-200 rounded-lg p-3 text-center'>
              <p className='text-green-700 font-semibold'>✓ In Cart</p>
              <p className='text-sm text-green-600'>Qty: {cartItem.quantity}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  )
}

export default Product