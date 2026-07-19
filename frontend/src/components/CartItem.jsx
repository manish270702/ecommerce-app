import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { mountCart } from '../store/reducers/Cart.Slice'

function CartItem({ item }) {
    const [quantity, setQuantity] = useState(item.quantity)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const token = useSelector((state) => state.token.value)
    const dispatch = useDispatch()

    const updateCart = async (productId, newQuantity) => {
        try {
            setLoading(true)
            setError('')

            // Validate quantity against stock
            if (newQuantity > item.stock) {
                setError(`Only ${item.stock} items available in stock`)
                setQuantity(item.stock)
                setLoading(false)
                return
            }

            if (newQuantity < 1) {
                setError('Quantity must be at least 1')
                setQuantity(1)
                setLoading(false)
                return
            }

            

            const res = await axios.post("http://localhost:3001/api/cart/", {
                productid: productId,
                quantity: newQuantity,
                price: item.price,
                stock: item.stock
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            dispatch(mountCart(res.data.item.items))
            setQuantity(newQuantity)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || 'Failed to update cart')
            setQuantity(item.quantity)
        } finally {
            setLoading(false)
        }
    }

    const removeItem = async () => {
        try {
            setLoading(true)
            await axios.delete(`http://localhost:3001/api/cart/${item.productid}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // Cart will be updated through Redux or parent component
        } catch (err) {
            console.error(err)
            setError('Failed to remove item')
        } finally {
            setLoading(false)
        }
    }

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value) || 1
        updateCart(item.productid, newQuantity)
    }

    const totalPrice = (item.price * quantity).toFixed(2)
    const stockStatus = item.stock === 0 ? 'Out of Stock' : `${item.stock} in stock`
    const stockClass = item.stock === 0 ? 'text-red-600' : item.stock <= 5 ? 'text-orange-600' : 'text-green-600'

    return (
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {/* Image Section */}
            <div className="mb-3 h-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                <img 
                    src={item.images?.[0]} 
                    alt={item.title} 
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Product Info */}
            <div className="mb-3">
                <h2 className="font-semibold text-lg text-gray-900 line-clamp-2">{item.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2 mt-1">{item.description}</p>
            </div>

            {/* Price Section */}
            <div className="mb-3 pb-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Unit Price:</span>
                    <span className="font-semibold text-lg text-gray-900">${item.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="font-bold text-lg text-blue-600">${totalPrice}</span>
                </div>
            </div>

            {/* Stock Status */}
            <div className="mb-4 pb-4 border-b border-gray-200">
                <p className={`text-sm font-medium ${stockClass}`}>
                    {stockStatus}
                </p>
            </div>

            {/* Quantity Control */}
            <div className="mb-4">
                <label htmlFor={`quantity-${item.productid}`} className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        id={`quantity-${item.productid}`}
                        min="1"
                        max={item.stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                        disabled={loading || item.stock === 0}
                        className="w-16 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-600">of {item.stock} available</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Remove Button */}
            <button
                onClick={removeItem}
                disabled={loading}
                className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Removing...' : 'Remove from Cart'}
            </button>
        </div>
    )
}

export default CartItem