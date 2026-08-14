import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartItem from './CartItem'
import axios from 'axios'
import { clearcart, mountCart } from '../store/reducers/Cart.Slice'
import { useNavigate } from 'react-router-dom'

function Cart() {
    const cart = useSelector((state) => state.cart.value)
    const token = useSelector((state) => state.token.value)
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()

    const dark = useSelector((state) => state.Dark.value)

    const dispatch = useDispatch()

    const calculateTotal = () => {
        return cart?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
    }

    const calculateItemCount = () => {
        return cart?.reduce((sum, item) => sum + item.quantity, 0)
    }

    // console.log(token)
    const handleCheckout = async () => {
        try {
            setLoading(true)
            const response = await axios.post("http://localhost:3003/api/orders", {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })


            // Handle successful order
            console.log('Order created:', response.data)

            dispatch(clearcart()) // Clear cart in Redux store
        } catch (err) {
            console.error('Checkout error:', err)
            alert(err.response?.data?.message || 'Failed to create order')
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className='w-full flex flex-col gap-4 p-4 min-h-screen items-center justify-center'>
                <h2 className='text-2xl font-semibold text-gray-900'>Please login to view cart</h2>
            </div>
        )
    }

    if (cart?.length === 0) {
        return (
            <>
                <div className='w-full flex flex-col gap-4 p-4 min-h-screen items-center justify-center'>
                    <h2 className='text-2xl font-semibold text-gray-900'>Your cart is empty</h2>
                    <p className='text-gray-600'>Add some products to get started!</p>
                    <div className="cursor-pointer bg-blue-600 text-white rounded-md px-4 py-2  " onClick={() => navigate(-1)}>Continue Shopping</div>
                </div>
            </>
        )
    }

    return (
        <div className={`w-full flex flex-col gap-6 p-6 min-h-screen ${dark ? "bg-zinc-950" : "bg-gray-50"}`}>
            <div className={`text-3xl cursor-pointer ${dark ? "text-zinc-400" : "text-gray-600"}`} onClick={() => navigate(-1)}>←</div>
            {/* Header */}
            <div className='mb-4'>
                <h1 className={`text-3xl font-bold ${dark ? "text-gray-300" : "text-gray-900"}`}>Shopping Cart</h1>
                <p className={`${dark ? "text-zinc-400" : "text-gray-600"} mt-2`}>You have {calculateItemCount()} item(s) in your cart</p>
            </div>

            {/* Cart Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Cart Items */}
                <div className={cart?.length > 0 ? "lg:col-span-4" : "lg:col-span-4"}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cart?.map((item) => (
                            <CartItem key={item.productid} item={item} />
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                {/* {cart?.length > 0 && (
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-6">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{calculateTotal()}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-semibold">FREE</span>
                                </div>

                                <hr />

                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-blue-600">₹{calculateTotal()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                            >
                                {loading ? "Processing..." : "Proceed to Checkout"}
                            </button>

                            <button
                                onClick={() => window.history.back()}
                                className="w-full mt-3 border rounded-lg py-3 hover:bg-gray-100"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )} */}
            </div>

            {/* Cart Summary */}

            {
                cart?.length > 0 && (
                    <div className={`mt-8 p-6 ${dark ? "bg-zinc-800" : "bg-white"} rounded-lg shadow-md`}>
                        <div className='space-y-3 mb-6'>
                            <div className='flex justify-between items-center'>
                                <span className={`text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>Subtotal:</span>
                                <span className={`text-lg font-semibold ${dark ? "text-gray-300" : "text-gray-900"}`}>
                                    {calculateTotal() || 0}
                                </span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className={`text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>Shipping:</span>
                                <span className={`text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>FREE</span>
                            </div>
                            <div className='border-t pt-3 flex justify-between items-center'>
                                <span className={`text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>Total:</span>
                                <span className={`text-2xl font-bold ${dark ? "text-blue-400" : "text-blue-600"}`}>
                                    {calculateTotal() || 0}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading || cart?.length === 0}
                            className={`w-full ${dark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? 'Processing...' : 'Proceed to Checkout'}
                        </button>

                        <button
                            className={`w-full mt-3 border ${dark ? "border-zinc-600 text-zinc-400" : "border-gray-300 text-gray-900"} font-semibold py-2 px-4 rounded-lg hover:${dark ? "bg-zinc-600" : "bg-gray-50"} transition-colors cursor-pointer`}
                            onClick={back => navigate(-1)}
                        >
                            Continue Shopping
                        </button>
                    </div>
                )
            }
        </div>
    )
}

export default Cart