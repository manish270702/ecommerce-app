import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

function ProductView() {

    const products = useSelector((state) => state.product.value)
    const { id } = useParams()
    const navigate = useNavigate()

    
    const dark = useSelector((state) => state.Dark.value)
    
    const product = products.find((p) => p._id === id || p.id === id)
    console.log(product)
    const [preview, setpreview] = useState(product?.images?.[0])

    return (
        <div className={`max-w-full min-h-screen ${dark ? "bg-zinc-800 text-white" : "bg-gray-100"} `}>
            <div className="max-w-4xl mx-auto py-8">
                <button
                    onClick={() => navigate(-1)}
                    className={`mb-4 px-4 py-2 ${dark ? "bg-zinc-700 text-white" : "bg-gray-300"} rounded-lg`}
                >
                    ← Back
                </button>
                <div id="img" className={`relative h-108  overflow-hidden  items-center justify-center border-b border-gray-6
                    00 pb-4 `}>
                    <img
                        src={preview || ""}
                        alt={product?.title}
                        className="h-80 w-full object-cover mb-3"
                    />

                    {product.discountPercentage && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            -{product.discountPercentage}%
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        {
                            product.images.map(item => (
                                <img className="cursor-pointer w-24" onClick={()=>setpreview(item)} src={item} />
                            ))
                        }
                    </div>
                </div>
                <h1 className="text-2xl font-bold">{product?.title}</h1>
                <h1 className="text-lg">{product?.description}</h1>
                <h1 className="text-lg">{product?.brand}</h1>
                <div className={`${dark ? "mb-4 pb-4  text-white" : "mb-4 pb-4  "}`}>

                    <div className="flex items-baseline gap-2">

                        <span className={`${dark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}`}>
                            ${product.price - product.price * product.discountPercentage / 100}
                        </span>

                        {product.discountPercentage && (
                            <span className="text-sm text-gray-500 line-through">
                                ${Number(product.price).toFixed(2)}
                            </span>
                        )}

                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProductView